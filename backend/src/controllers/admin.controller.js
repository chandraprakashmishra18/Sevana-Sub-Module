const prisma = require("../config/prisma");

// GET /api/admin/organizations
// List organizations awaiting verification
const getPendingOrganizations = async (req, res) => {
  try {
    const organizations = await prisma.organization.findMany({
      where: {
        verificationStatus: "PENDING"
      },
      select: {
        id: true,
        name: true,
        type: true,
        verificationStatus: true,
        verifiedAt: true
      }
    });

    return res.status(200).json({
      success: true,
      count: organizations.length,
      data: organizations
    });
  } catch (error) {
    console.error("Get pending organizations error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch pending organizations."
    });
  }
};

// PATCH /api/admin/organizations/:organizationId/verification
// Approve or reject an organization
const updateOrganizationVerification = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const { verificationStatus } = req.body;

    if (!["VERIFIED", "REJECTED"].includes(verificationStatus)) {
      return res.status(400).json({
        success: false,
        message: "verificationStatus must be VERIFIED or REJECTED."
      });
    }

    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        organizationId
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid organization ID."
      });
    }

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId }
    });

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found."
      });
    }

    const updatedOrganization = await prisma.organization.update({
      where: { id: organizationId },
      data: {
        verificationStatus,
        verifiedAt:
          verificationStatus === "VERIFIED" ? new Date() : null
      },
      select: {
        id: true,
        name: true,
        type: true,
        verificationStatus: true,
        verifiedAt: true
      }
    });

    return res.status(200).json({
      success: true,
      message:
        verificationStatus === "VERIFIED"
          ? "Organization verified successfully."
          : "Organization rejected successfully.",
      data: updatedOrganization
    });
  } catch (error) {
    console.error("Update organization verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update organization verification."
    });
  }
};

module.exports = {
  getPendingOrganizations,
  updateOrganizationVerification
};
