CREATE TABLE "spatial_ref_sys" (
    "srid" INTEGER NOT NULL,
    "auth_name" VARCHAR(256),
    "auth_srid" INTEGER,
    "srtext" VARCHAR(2048),
    "proj4text" VARCHAR(2048),

    CONSTRAINT "spatial_ref_sys_pkey" PRIMARY KEY ("srid")
);