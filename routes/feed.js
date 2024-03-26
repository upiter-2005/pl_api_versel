const express = require("express");
const router = express.Router();
const xml2js = require('xml2js');
const  { create } = require('xmlbuilder2');
const XML = require('xml');


const { Client } = require("@notionhq/client");
const notion = new Client({ auth: "secret_RMljMMkRKKHMAdtCynOXqJi39pJfwLDNshOKvSgspi5" });
const databaswId = "c07fa663465e4589bab3e02ebd925d54";



router.get("/", async (req, res, next) => {

  try {
    const data = await notion.databases.query({
      database_id: databaswId,
      sorts: [
        {
          property: "Name",
          direction: "ascending",
        },
      ],
    });

    const cars = {data}
    const tempArr = cars.data.results.filter( obj=> obj.properties.Status.status?.name === "Done")
 
   

    const root = create({ version: '1.0' })
  .ele('rss', {'xmlns:g': "http://base.google.com/ns/1.0"})
  
   const container = root.ele('channel')
   // .ele('channel')
      .ele('title').txt('Drivovo').up()
      .ele('link').txt('https://drivovo.com').up()
      .ele('description').txt('Drivovo description').up();

        for(let i = 1; i < tempArr.length; i++)
        {

          const startFund = (
            parseInt(tempArr[i]?.properties.car_price_ex_showroom.number) +
            parseFloat(tempArr[i]?.properties.pension_fund.formula.number.toFixed(0)) +
            parseFloat(tempArr[i]?.properties.insurance_1_year.formula.number) +
            parseFloat(tempArr[i]?.properties.registration.formula.number) +
            parseFloat(tempArr[i]?.properties.luxury_tax.number) +
            parseFloat(tempArr[i]?.properties.tinted_glass.formula.number) +
            parseFloat(tempArr[i]?.properties.tires.number) +
            parseFloat(tempArr[i]?.properties.carpets.number) +
            parseFloat(tempArr[i]?.properties.safety_net.formula.number) +
            parseFloat(tempArr[i]?.properties.radiator_protection.number) +
            parseFloat(tempArr[i]?.properties.armored_film.number)
          )

          const result = (
            parseFloat(startFund) +
            parseFloat(((startFund / 100) * 21).toFixed(2)) +
            parseFloat(tempArr[i]?.properties.tire_service.formula.number) +
            parseFloat(tempArr[i]?.properties.luxury_tax_2_years.number) +
            parseFloat(tempArr[i]?.properties.osago_2_year.formula.number) +
            parseFloat(tempArr[i]?.properties.maintenance.formula.number) +
            parseFloat(tempArr[i]?.properties.insurance_2_year.formula.number)
          ).toFixed(2);

          const dop = parseInt(tempArr[i]?.properties.car_price_ex_showroom.number) +
                    parseFloat(tempArr[i]?.properties.carpets.number) +
                    parseFloat(tempArr[i]?.properties.armored_film.number);
          const persent = parseFloat(tempArr[i]?.properties.residual_value?.number);
          const maxPrice = parseFloat(result) + parseFloat(result * 0.13);
          const last40 = dop * persent;
          const price = (parseFloat(maxPrice - last40) / 36).toFixed(0);
            console.log(tempArr[i]); 
            const item = container.ele('item');
            item.ele('id').txt(tempArr[i]?.id).up();
            item.ele('title').txt(tempArr[i]?.properties.car_name.rich_text[0]?.plain_text).up();
            item.ele('description').txt(tempArr[i]?.properties.Text.rich_text[0]?.text.content).up();
            item.ele('availability').txt('in stock').up();
            item.ele('condition').txt('new').up();
            item.ele('price').txt(`${price} USD`).up();
            item.ele('link').txt(`https://offer.drivovo.com/offer/${tempArr[i]?.properties.URL?.rich_text[0]?.plain_text}`).up();
            item.ele('image_link').txt(tempArr[i]?.properties.Cover.files[0]?.file.url).up();
            item.ele('brand').txt(tempArr[i]?.properties.car_brand.select?.name).up();
            
         
        }
      //.ele('item');
//     .up()
//   .up();
console.log(root.channel);
// convert the XML tree to string
const xml = root.end({ prettyPrint: true });
console.log(xml);
    
  res.header('Content-Type','text/xml').send(xml)


  } catch (e) {
    console.log(e);
    return res.json({message : e});
  }
});

module.exports = router;
