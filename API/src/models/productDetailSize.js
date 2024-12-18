"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductDetailSize extends Model {
    static associate(models) {
      // Liên kết với mô hình ProductDetail
      ProductDetailSize.belongsTo(models.ProductDetail, {
        foreignKey: "productdetailId",
        targetKey: "id",
        as: "productDetailSizeData", // Alias cần sử dụng trong câu truy vấn
      });

      ProductDetailSize.belongsTo(models.Allcode, {
        foreignKey: "sizeId",
        targetKey: "code",
        as: "sizeData",
      });
    }
  }
  ProductDetailSize.init(
    {
      productdetailId: DataTypes.INTEGER,
      width: DataTypes.STRING,
      height: DataTypes.STRING,
      weight: DataTypes.STRING,
      sizeId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ProductDetailSize",
    }
  );
  return ProductDetailSize;
};
