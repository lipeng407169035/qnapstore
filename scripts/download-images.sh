#!/bin/bash

# QNAP Product Image Downloader
# 这个脚本尝试从 QNAP 官网下载产品图片

mkdir -p public/images/products

PRODUCTS=(
  "TS-264"
  "TS-464"
  "TS-233"
  "TS-364"
  "TS-873A"
  "TS-673A"
  "TVS-h874"
  "TS-1683XU-RP"
  "TS-832PX"
  "QSW-1105-5T"
  "QSW-M408S"
  "QSW-M2116P"
  "UX-1200U-RP"
  "QXG-10G1T"
  "QXG-25G2SF"
  "LIC-NVR-4CH"
  "LIC-VJBOD-1Y"
  "QEWS-2Y"
  "RAM-8GDDR4"
  "RAM-16GDDR5"
)

echo "========================================="
echo "QNAP 产品图片下载工具"
echo "========================================="
echo ""
echo "注意：由于 QNAP 官网有反爬虫机制，"
echo "此脚本可能无法直接下载图片。"
echo ""
echo "建议手动下载图片的方法："
echo "1. 访问 https://www.qnap.com/zh-tw/product/"
echo "2. 找到对应产品的页面"
echo "3. 右键保存产品图片"
echo "4. 将图片放到 public/images/products/[产品型号]/ 目录"
echo ""
echo "图片目录结构："
echo "public/images/products/"
echo "  ├── TS-464/"
echo "  │   ├── 1.jpg  (正面)"
echo "  │   ├── 2.jpg  (背面)"
echo "  │   ├── 3.jpg  (側面)"
echo "  │   ├── 4.jpg  (內部)"
echo "  │   ├── 5.jpg  (包裝)"
echo "  │   └── 6.jpg  (配件)"
echo "  ├── TS-264/"
echo "  │   └── ..."
echo "  └── ..."
echo ""

# 尝试创建目录结构
for product in "${PRODUCTS[@]}"; do
  mkdir -p "public/images/products/$product"
done

echo "已创建产品图片目录，请手动添加图片。"
