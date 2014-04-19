//----------------------------------------------------------------
// product class
function product(sku, name, description, price, sizes, colors) {
    this.sku = sku; // product code (SKU = stock keeping unit)
    this.name = name;
    this.description = description;
    this.price = price;
    this.sizes = sizes;
    this.colors = colors;
    this.colorCodes = {"brown":19,"yellow":30,"cerise":60,"green":72,"blue":89,"red":99}; //move this to an own static entity
    }
