import puppeteer from "puppeteer";

export const parcing = async (req, res, next) => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://kyivstar.ua/tariffs");

    const tariffs = await page.evaluate(async () => {
      const list = Array.from(
        document.querySelectorAll("[data-index]"),
        (el) => el.innerText
      );

      console.log(list);

      const newList = list.map((el) => el.split("\n"));

      return newList;
    });

    await browser.close();

    res.status(200).json({ data: tariffs });
  } catch (e) {
    next(e);
  }
};
