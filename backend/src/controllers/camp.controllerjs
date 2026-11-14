
const prisma = require("../config/prisma");
const {
  createCampSchema,
  updateCampSchema
} = require("../validators/camp.validator");

// -----------------------------------------------------
// ASYNC HANDLER
// -----------------------------------------------------

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// -----------------------------------------------------
// AUTHORIZATION HELPER
// -----------------------------------------------------

const MANAGER_ROLES = ["OWNER", "ADMIN", "COORDINATOR"];

async function checkOrganizationPermission(userId, organizationId) {
  const membership = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId
      }
    },
    select: {
      role: true,
      organization: {
        select: {
          verificationStatus: true
        }
      }
    }
  });

  if (!membership || !MANAGER_ROLES.includes(membership.role)) {
    return {
      allowed: false,
      message: "You are not authorized to manage this organization's camps."
    };
  }

  if (
    membership.organization.verificationStatus === "REJECTED" ||
    membership.organization.verificationStatus === "SUSPENDED"
  ) {
    return {
      allowed: false,
      message: "This organization is not permitted to manage camps."
    };
  }

  return {
    allowed: true,
    verificationStatus: membership.organization.verificationStatus
  };
}

// -----------------------------------------------------
// CREATE CAMP
// POST /api/camps
// -----------------------------------------------------

const createCamp = asyncHandler(async (req, res) => {
  const validation = createCampSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: validation.error.flatten()
    });
  }

  const data = validation.data;

  const permission = await checkOrganizationPermission(
    req.user.id,
    data.organizationId
  );

  if (!permission.allowed) {
    return res.status(403).json({
      success: false,
      message: permission.message
    });
  }

  const camp = await prisma.camp.create({
    data: {
      ...data,
      createdById: req.user.id,
      status: "DRAFT"
    },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
          verificationStatus: true
        }
      }
    }
  });

  return res.status(201).json({
    success: true,
    message: "Camp created successfully.",
    data: camp
  });
});

// -----------------------------------------------------
// GET ALL PUBLISHED CAMPS
// GET /api/camps
// -----------------------------------------------------

const getCamps = asyncHandler(async (req, res) => {
  const {
    type,
    city,
    state,
    page = "1",
    limit = "10"
  } = req.query;

  if (type && !["MEDICAL", "EDUCATIONAL"].includes(type)) {
    return res.status(400).json({
      success: false,
      message: "Invalid camp type."
    });
  }

  const pageNumber = Number(page);
  const pageSize = Number(limit);

  if (
    !Number.isInteger(pageNumber) ||
    !Number.isInteger(pageSize) ||
    pageNumber < 1 ||
    pageSize < 1 ||
    pageSize > 100
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid pagination parameters."
    });
  }

  const where = {
    status: "PUBLISHED",

    ...(type && { type }),

    ...(city && {
      city: {
        contains: city,
        mode: "insensitive"
      }
    }),

    ...(state && {
      state: {
        contains: state,
        mode: "insensitive"
      }
    })
  };

  const [camps, total] = await prisma.$transaction([
    prisma.camp.findMany({
      where,
      include: {
        organization: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            registrations: true
          }
        }
      },
      orderBy: {
        startsAt: "asc"
      },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize
    }),

    prisma.camp.count({ where })
  ]);

  return res.status(200).json({
    success: true,
    data: camps,
    pagination: {
      page: pageNumber,
      limit: pageSize,
      total,
      totalPages: Math.ceil(total / pageSize)
    }
  });
});

// -----------------------------------------------------
// GET CAMP DETAILS
// GET /api/camps/:campId
// -----------------------------------------------------

const getCampById = asyncHandler(async (req, res) => {
  const { campId } = req.params;

  const camp = await prisma.camp.findUnique({
    where: { id: campId },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
          type: true,
          verificationStatus: true
        }
      },
      _count: {
        select: {
          registrations: {
            where: {
              status: "REGISTERED"
            }
          }
        }
      }
    }
  });

  // Do not expose unpublished camps publicly.
  if (!camp || camp.status !== "PUBLISHED") {
    return res.status(404).json({
      success: false,
      message: "Published camp not found."
    });
  }

  return res.status(200).json({
    success: true,
    data: camp
  });
});

// -----------------------------------------------------
// UPDATE CAMP
// PATCH /api/camps/:campId
// -----------------------------------------------------

const updateCamp = asyncHandler(async (req, res) => {
  const { campId } = req.params;

  const validation = updateCampSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: validation.error.flatten()
    });
  }

  const data = validation.data;

  const camp = await prisma.camp.findUnique({
    where: { id: campId }
  });

  if (!camp) {
    return res.status(404).json({
      success: false,
      message: "Camp not found."
    });
  }

  const permission = await checkOrganizationPermission(
    req.user.id,
    camp.organizationId
  );

  if (!permission.allowed) {
    return res.status(403).json({
      success: false,
      message: permission.message
    });
  }

  if (["CANCELLED", "COMPLETED"].includes(camp.status)) {
    return res.status(409).json({
      success: false,
      message: "Cancelled or completed camps cannot be updated."
    });
  }

  // Validate the final dates, including unchanged existing values.
  const startsAt = data.startsAt ?? camp.startsAt;
  const endsAt = data.endsAt ?? camp.endsAt;

  const registrationDeadline =
    data.registrationDeadline === undefined
      ? camp.registrationDeadline
      : data.registrationDeadline;

  if (endsAt <= startsAt) {
    return res.status(400).json({
      success: false,
      message: "End date must be after start date."
    });
  }

  if (registrationDeadline && registrationDeadline > startsAt) {
    return res.status(400).json({
      success: false,
      message: "Registration deadline must be on or before the camp start date."
    });
  }

  const updatedCamp = await prisma.camp.update({
    where: { id: campId },
    data,
    include: {
      organization: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });

  return res.status(200).json({
    success: true,
    message: "Camp updated successfully.",
    data: updatedCamp
  });
});

// -----------------------------------------------------
// PUBLISH CAMP
// POST /api/camps/:campId/publish
// -----------------------------------------------------

const publishCamp = asyncHandler(async (req, res) => {
  const { campId } = req.params;

  const camp = await prisma.camp.findUnique({
    where: { id: campId },
    include: {
      organization: {
        select: {
          verificationStatus: true
        }
      }
    }
  });

  if (!camp) {
    return res.status(404).json({
      success: false,
      message: "Camp not found."
    });
  }

  const permission = await checkOrganizationPermission(
    req.user.id,
    camp.organizationId
  );

  if (!permission.allowed) {
    return res.status(403).json({
      success: false,
      message: permission.message
    });
  }

  if (camp.status !== "DRAFT") {
    return res.status(409).json({
      success: false,
      message: "Only draft camps can be published."
    });
  }

  if (permission.verificationStatus !== "VERIFIED") {
    return res.status(403).json({
      success: false,
      message: "Only verified organizations can publish camps."
    });
  }

  const now = new Date();

  if (camp.startsAt <= now || camp.endsAt <= camp.startsAt) {
    return res.status(400).json({
      success: false,
      message: "Camp dates must be valid and the start date must be in the future."
    });
  }

  if (
    camp.registrationDeadline &&
    camp.registrationDeadline > camp.startsAt
  ) {
    return res.status(400).json({
      success: false,
      message: "Registration deadline must be on or before the camp start date."
    });
  }

  const publishedCamp = await prisma.camp.update({
    where: { id: campId },
    data: {
      status: "PUBLISHED"
    }
  });

  return res.status(200).json({
    success: true,
    message: "Camp published successfully.",
    data: publishedCamp
  });
});

// -----------------------------------------------------
// CANCEL CAMP
// POST /api/camps/:campId/cancel
// -----------------------------------------------------

const cancelCamp = asyncHandler(async (req, res) => {
  const { campId } = req.params;

  const camp = await prisma.camp.findUnique({
    where: { id: campId }
  });

  if (!camp) {
    return res.status(404).json({
      success: false,
      message: "Camp not found."
    });
  }

  const permission = await checkOrganizationPermission(
    req.user.id,
    camp.organizationId
  );

  if (!permission.allowed) {
    return res.status(403).json({
      success: false,
      message: permission.message
    });
  }

  if (["CANCELLED", "COMPLETED"].includes(camp.status)) {
    return res.status(409).json({
      success: false,
      message: "This camp cannot be cancelled."
    });
  }

  const cancelledCamp = await prisma.camp.update({
    where: { id: campId },
    data: {
      status: "CANCELLED"
    }
  });

  return res.status(200).json({
    success: true,
    message: "Camp cancelled successfully.",
    data: cancelledCamp
  });
});

// -----------------------------------------------------
// EXPORTS
// -----------------------------------------------------

module.exports = {
  createCamp,
  getCamps,
  getCampById,
  updateCamp,
  publishCamp,
  cancelCamp
};