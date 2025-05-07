const skipArray = [
	{ page: 2000, skip: 20000 },
	{ page: 4000, skip: 40000 },
	{ page: 6000, skip: 60000 },
	{ page: 8000, skip: 80000 },
	{ page: 10000, skip: 100000 },
	{ page: 12000, skip: 120000 },
	{ page: 14000, skip: 140000 },
	{ page: 16000, skip: 160000 },
	{ page: 18000, skip: 180000 },
	{ page: 20000, skip: 200000 },
	{ page: 22000, skip: 220000 },
	{ page: 24000, skip: 240000 },
	{ page: 26000, skip: 260000 },
	{ page: 28000, skip: 280000 },
	{ page: 30000, skip: 300000 },
	{ page: 32000, skip: 320000 },
	{ page: 34000, skip: 340000 },
	{ page: 36000, skip: 360000 },
	{ page: 38000, skip: 380000 },
	{ page: 40000, skip: 400000 },
	{ page: 42000, skip: 420000 },
	{ page: 44000, skip: 440000 },
	{ page: 46000, skip: 460000 },
	{ page: 48000, skip: 480000 },
	{ page: 50000, skip: 500000 },
	{ page: 52000, skip: 520000 },
	{ page: 54000, skip: 540000 },
	{ page: 56000, skip: 560000 },
	{ page: 58000, skip: 580000 },
	{ page: 60000, skip: 600000 },
	{ page: 62000, skip: 620000 },
	{ page: 64000, skip: 640000 },
	{ page: 66000, skip: 660000 },
	{ page: 68000, skip: 680000 },
	{ page: 70000, skip: 700000 },
	{ page: 72000, skip: 720000 },
	{ page: 74000, skip: 740000 },
	{ page: 76000, skip: 760000 },
	{ page: 78000, skip: 780000 },
	{ page: 80000, skip: 800000 },
	{ page: 82000, skip: 820000 },
	{ page: 84000, skip: 840000 },
	{ page: 86000, skip: 860000 },
	{ page: 88000, skip: 880000 },
	{ page: 90000, skip: 900000 },
	{ page: 92000, skip: 920000 },
	{ page: 94000, skip: 940000 },
	{ page: 96000, skip: 960000 },
	{ page: 98000, skip: 980000 },
	{ page: 100000, skip: 1000000 }
  ];
  
  export function getSkipObject(pageValue) {
	for (let i = skipArray.length - 1; i >= 0; i--) {
	  if (pageValue > skipArray[i].page) {
		return skipArray[i];
	  }
	}
	return {page:0,skip:0};
  }

  