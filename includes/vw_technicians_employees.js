// includes/vw_technicians_employees.js
module.exports = (companyId, projectId, rawDataset) =>
  publish("vw_technicians_employees_" + companyId, {
    type: "view",
    name: "vw_technicians_employees",
    database: projectId,
    schema: "dashboards",
    description: "Unified view of Technicians and Employees per company. Shared base for vw_job_technicians and other dashboard views.",
    tags: ["dashboards", "vw_technicians_employees"]
  })
    .query(`
  SELECT 'Technician'        AS emp_type
        , id                 AS id
        , name               AS name
        , business_unit_id   AS business_unit_id
        , login_name         AS login_name
        , email              AS email
        , user_id            AS user_id
        , active             AS active
        , role_id            AS roles_ids
        , is_managed_tech    AS is_managed_tech
    FROM \`${projectId}.${rawDataset}.technician\`
  UNION ALL
  SELECT 'Employee'          AS emp_type
        , id                 AS id
        , name               AS name
        , CAST(JSON_VALUE(TO_JSON_STRING(t), '$.business_unit_id') AS INT64) AS business_unit_id
        , login_name         AS login_name
        , email              AS email
        , user_id            AS user_id
        , active             AS active
        , role_id            AS roles_ids
        , NULL               AS is_managed_tech
    FROM \`${projectId}.${rawDataset}.employee\` AS t
  `);
