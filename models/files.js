module.exports = (sequelize, DataType) => {
  const Files = sequelize.define('Files', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataType.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    parentID: {
      type: DataType.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    contain: {
      type: DataType.STRING,
      allowNull: false,
      defaultValue: '',
    },
    tags: {
      type: DataType.ARRAY(DataType.STRING),
      allowNull: false,
      defaultValue: [],
    },
    kind: {
      type: DataType.STRING,
      allowNull: false,
      defaultValue: 'folder',
      validate: {
        notEmpty: true,
      },
    },
    visible: {
      type: DataType.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

  }, {
    classMethods: {
      associate: (models) => {
        Files.belogsTo(models.Users, { foreignKey: 'userID' });
      },
    },
  });

  return Files;
};