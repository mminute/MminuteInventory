export const v100 = 'v1.0.0';

const Schemas = {
  // Semantic versioning: https://semver.org/
  [v100]:
    'id,name,serialNumber,category,quantity,description,location,dateAcquired,dateRelinquished,notes,url,archived',
  'v1.1.0':
    'id,created,name,serialNumber,category,quantity,description,location,dateAcquired,dateRelinquished,notes,url,archived',
};

export default Schemas;
