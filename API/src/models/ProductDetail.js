"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductDetail extends Model {
    static associate(models) {
      ProductDetail.belongsTo(models.Product, {
        foreignKey: "productId",
        targetKey: "id",
        as: "productDetailData",
      });
      ProductDetail.hasMany(models.ProductImage, {
        foreignKey: "productdetailId",
        as: "productImageData",
      });

      ProductDetail.hasMany(models.ProductDetailSize, {
        foreignKey: "productdetailId",
        as: "productDetailSizeData",
      });
    }
  }
  ProductDetail.init(
    {
      productId: DataTypes.INTEGER,
      nameDetail: DataTypes.STRING,
      originalPrice: DataTypes.BIGINT,
      discountPrice: DataTypes.BIGINT,
      description: DataTypes.TEXT("long"),
      contentHTML: DataTypes.TEXT("long"), // Trường mới
    },
    {
      sequelize,
      modelName: "ProductDetail",
    }
  );
  return ProductDetail;
};
