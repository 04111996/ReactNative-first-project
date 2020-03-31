export const RESPONSE_OBJECT = {
    newCase: {
        sfdcId: "sfdc1",
        loanStatus: "initiated",
        createdTime: 1541938807,
        limitRequirement: "5.5L",
        recommendedPrograms: [{
            planId: "12",
            planName: "First plan",
            planTerms: ["abc"]
        },
        {
            planId: "13",
            planName: "Second plan",
            planTerms: ["first term", "second term"]
        }

        ]
    },
    getAllCases: [
        {
            sfdcID: "sfdc1",
            selectedPlanId: "12",
            loanStatus: "processing",
            recommendedPrograms: [
                {
                    planId: "12",
                    planName: "First plan",
                    planTerms: ["abc"]
                },
                {
                    planId: "13",
                    planName: "Second plan",
                    planTerms: ["first term", "second term"]
                }
            ],
            createdTime: 1541938807,
            caseDetails: [{
                entityDetails: {
                    entityname: 'Sharma and Sons',
                    contactPerson: 'Sharma',
                    contactNumber: {
                        primaryContactNumber: '9876543210',
                        alternateContactNumbers: ['9876543211', '987654322']
                    },
                    limitRequirement: 5565655555,
                },
                financials: {
                    turnOverForLast12Months: 123450,
                    netProfitForLastFianacialYear: 300000,
                },
                collateral: {
                    collateralType: 'Self-occupied residential property',
                    collateralValue: [500000, 700000]
                },
                existingLimit: {
                    isExistingLimit: true,
                    existingLimit: 4546576,
                },
                business: {
                    typeOfIndustry: 'Manufacturer',
                    businessType: 'Trading',
                    vintageOfBusiness: null
                },
                timestamp: 1541938807
            }]
        },
        {
            sfdcID: "sfdc2",
            selectedPlanId: "12",
            loanStatus: "processing",
            recommendedPrograms: [
                {
                    planId: "12",
                    planName: "First plan",
                    planTerms: ["abc"]
                },
                {
                    planId: "13",
                    planName: "Second plan",
                    planTerms: ["first term", "second term"]
                }
            ],
            createdTime: 1541938807,
            caseDetails: [{
                entityDetails: {
                    entityname: 'Sharma and brother',
                    contactPerson: 'Ravi',
                    contactNumber: {
                        primaryContactNumber: '9876543210',
                        alternateContactNumbers: ['9876543211', '987654322']
                    },
                    limitRequirement: 5565655555,
                },
                financials: {
                    turnOverForLast12Months: 123450,
                    netProfitForLastFianacialYear: 300000,
                },
                collateral: {
                    collateralType: 'Self-occupied residential property',
                    collateralValue: [500000, 700000]
                },
                existingLimit: {
                    isExistingLimit: true,
                    existingLimit: 4546576,
                },
                business: {
                    typeOfIndustry: 'Manufacturer',
                    businessType: 'Trading',
                    vintageOfBusiness: null
                },
                timestamp: 1541938807
            }]
        },
        {
            sfdcID: "sfdc3",
            selectedPlanId: "13",
            loanStatus: "processing",
            recommendedPrograms: [
                {
                    planId: "12",
                    planName: "First plan",
                    planTerms: ["abc"]
                },
                {
                    planId: "13",
                    planName: "Second plan",
                    planTerms: ["first term", "second term"]
                }
            ],
            createdTime: 1541938807,
            caseDetails: [{
                entityDetails: {
                    entityname: 'Sharma and Cousins',
                    contactPerson: 'Sana',
                    contactNumber: {
                        primaryContactNumber: '9876543210',
                        alternateContactNumbers: ['9876543211', '987654322']
                    },
                    limitRequirement: 5565655555,
                },
                financials: {
                    turnOverForLast12Months: 123450,
                    netProfitForLastFianacialYear: 300000,
                },
                collateral: {
                    collateralType: 'Self-occupied residential property',
                    collateralValue: [500000, 700000]
                },
                existingLimit: {
                    isExistingLimit: false,
                    existingLimit: null,
                },
                business: {
                    typeOfIndustry: 'Transport',
                    businessType: 'Goods transport',
                    vintageOfBusiness: null
                },
                timestamp: 1541938807
            }]
        },
    ],
    getCase: {
        sfdcID: "sfdc1",
        selectedPlanId: "12",
        loanStatus: "processing",
        recommendedPrograms: [
            {
                planId: "12",
                planName: "First plan",
                planTerms: ["abc"]
            },
            {
                planId: "13",
                planName: "Second plan",
                planTerms: ["first term", "second term"]
            }
        ]
    },
    applicantKycInfo: 1,
    applicantGuarantorResponse: {
        sfdcId: 'sfdc123',
        guarantorIds: [111, 112, 124]
    },
    flashConfig: {
        "configuration": {
            "banks": [
                {
                    "bankCode": "ABH",
                    "bankName": "ABHYUDAYA CO OP BANK LTD"
                },
                {
                    "bankCode": "ABN",
                    "bankName": "THE ROYAL BANK OF SCOTLAND N V"
                },
                {
                    "bankCode": "ADC",
                    "bankName": "AKOLA DISTRICT CENTRAL COOP BANK"
                },
                {
                    "bankCode": "AKJ",
                    "bankName": "AKOLA JANATA COMMERCIAL COOP BANK"
                },
                {
                    "bankCode": "ALL",
                    "bankName": "ALLAHABAD BANK"
                },
                {
                    "bankCode": "AMC",
                    "bankName": "AHMEDABAD MERCANTILE COOP BANK"
                },
                {
                    "bankCode": "AND",
                    "bankName": "ANDHRA BANK"
                },
                {
                    "bankCode": "ANZ",
                    "bankName": "AUSTRALIA NEWZELAND BANK GROUP LTD"
                },
                {
                    "bankCode": "APB",
                    "bankName": "THE AP STATE COOP BANK LTD"
                },
                {
                    "bankCode": "APG",
                    "bankName": "ANDHRA PRAGATHI GRAMEENA BANK"
                },
                {
                    "bankCode": "APM",
                    "bankName": "THE A P MAHESH CO OP URBAN BANK"
                },
                {
                    "bankCode": "ASB",
                    "bankName": "APNA SAHAKARI BANK LTD"
                },
                {
                    "bankCode": "AUC",
                    "bankName": "ALMORA URBAN COOP BANK LTD"
                },
                {
                    "bankCode": "BAC",
                    "bankName": "BASSEIN CATHOLIC COOP BANK LTD"
                },
                {
                    "bankCode": "BAR",
                    "bankName": "BANK OF BARODA"
                },
                {
                    "bankCode": "BBK",
                    "bankName": "BANK OF BAHRAIN AND KUWAIT B S C"
                },
                {
                    "bankCode": "BCB",
                    "bankName": "BHARAT COOP BANK MUMBAI LTD"
                },
                {
                    "bankCode": "BCE",
                    "bankName": "BANK OF CEYLON"
                },
                {
                    "bankCode": "BKD",
                    "bankName": "DENA BANK"
                },
                {
                    "bankCode": "BKI",
                    "bankName": "BANK OF INDIA"
                },
                {
                    "bankCode": "BNP",
                    "bankName": "BNP PARIBAS"
                },
                {
                    "bankCode": "BOF",
                    "bankName": "BANK OF AMERICA"
                },
                {
                    "bankCode": "BOT",
                    "bankName": "THE BANK OF TOKYO MITSUBISHI LTD"
                },
                {
                    "bankCode": "CBI",
                    "bankName": "CENTRAL BANK OF INDIA"
                },
                {
                    "bankCode": "CCB",
                    "bankName": "CITIZEN CREDIT COOP BANK LTD"
                },
                {
                    "bankCode": "CCI",
                    "bankName": "THE CLEARING COOP OF INDIA LTD"
                },
                {
                    "bankCode": "CHA",
                    "bankName": "JPMORGAN CHASE BANK"
                },
                {
                    "bankCode": "CIT",
                    "bankName": "CITI BANK"
                },
                {
                    "bankCode": "CIU",
                    "bankName": "CITY UNION BANK LTD"
                },
                {
                    "bankCode": "CLB",
                    "bankName": "CAPITAL LOCAL AREA BANK LTD"
                },
                {
                    "bankCode": "CNR",
                    "bankName": "CANARA BANK"
                },
                {
                    "bankCode": "COR",
                    "bankName": "CORPORATION BANK"
                },
                {
                    "bankCode": "COS",
                    "bankName": "THE COSMOS COOP BANK LTD"
                },
                {
                    "bankCode": "CRE",
                    "bankName": "CREDIT SUISSE AG"
                },
                {
                    "bankCode": "CRL",
                    "bankName": "CREDIT AGRICOLE CORP N INVSMNT BANK"
                },
                {
                    "bankCode": "CRU",
                    "bankName": "SHRI CHHATRAPATI RAJ SHAHU UCB LTD"
                },
                {
                    "bankCode": "CSB",
                    "bankName": "CATHOLIC SYRIAN BANK LTD"
                },
                {
                    "bankCode": "CTB",
                    "bankName": "COMMONWEALTH BANK OF AUSTRALIA"
                },
                {
                    "bankCode": "CTC",
                    "bankName": "CHINATRUST COMMERCIAL BANK LTD"
                },
                {
                    "bankCode": "DBS",
                    "bankName": "DEVELOPMENT BANK OF SINGAPORE"
                },
                {
                    "bankCode": "DCB",
                    "bankName": "DEVELOPMENT CREDIT BANK"
                },
                {
                    "bankCode": "DEU",
                    "bankName": "DEUSTCHE BANK"
                },
                {
                    "bankCode": "DIC",
                    "bankName": "DEPOSIT INS AND CR GUAR CORPN"
                },
                {
                    "bankCode": "DLX",
                    "bankName": "THE DHANALAKSHMI BANK LTD"
                },
                {
                    "bankCode": "DNS",
                    "bankName": "DNS BANK LTD"
                },
                {
                    "bankCode": "DSI",
                    "bankName": "DEUTSCHE SECURITIES INDIA PVT LTD"
                },
                {
                    "bankCode": "EIB",
                    "bankName": "EXPORT IMPORT BANK OF INDIA"
                },
                {
                    "bankCode": "FDR",
                    "bankName": "FEDERAL BANK LTD"
                },
                {
                    "bankCode": "FIR",
                    "bankName": "FIRSTRAND BANK LTD"
                },
                {
                    "bankCode": "GBC",
                    "bankName": "THE GREATER BOMBAY COOP BANK LTD"
                },
                {
                    "bankCode": "GDC",
                    "bankName": "THE GDCC BANK LTD"
                },
                {
                    "bankCode": "GGB",
                    "bankName": "GURGAON GRAMIN BANK"
                },
                {
                    "bankCode": "GSC",
                    "bankName": "THE GUJARAT STATE COOP BANK"
                },
                {
                    "bankCode": "GSI",
                    "bankName": "GOLDMAN SACH (INDIA) CAPITAL MARKET"
                },
                {
                    "bankCode": "HDF",
                    "bankName": "HDFC BANK"
                },
                {
                    "bankCode": "HSB",
                    "bankName": "HSBC BANK"
                },
                {
                    "bankCode": "HVB",
                    "bankName": "WOORI BANK"
                },
                {
                    "bankCode": "IBB",
                    "bankName": "BANK INTERNATIONAL INDONESIA"
                },
                {
                    "bankCode": "IBK",
                    "bankName": "IDBI BANK LTD"
                },
                {
                    "bankCode": "ICB",
                    "bankName": "INDUSTRIAL AND COMMERCIAL BANK OF C"
                },
                {
                    "bankCode": "ICI",
                    "bankName": "ICICI BANK LTD"
                },
                {
                    "bankCode": "ICL",
                    "bankName": "INDIAN CLEARING CORPORATION LIMITED"
                },
                {
                    "bankCode": "IDI",
                    "bankName": "INDIAN BANK"
                },
                {
                    "bankCode": "IND",
                    "bankName": "INDUSIND BANK"
                },
                {
                    "bankCode": "IOB",
                    "bankName": "INDIAN OVERSEAS BANK"
                },
                {
                    "bankCode": "ISE",
                    "bankName": "ICICI SECURITIES LIMITED"
                },
                {
                    "bankCode": "JAK",
                    "bankName": "JAMMU AND KASHMIR BANK LTD"
                },
                {
                    "bankCode": "JAN",
                    "bankName": "JANASEVA SAHAKARI BANK LTD"
                },
                {
                    "bankCode": "JAS",
                    "bankName": "JANASEVA SAHAKARI BANK (BORIVLI) LT"
                },
                {
                    "bankCode": "JJS",
                    "bankName": "JALGAON JANATA SAHKARI BANK LTD"
                },
                {
                    "bankCode": "JPC",
                    "bankName": "THE JALGAON PEOPLES COOP BANK LTD"
                },
                {
                    "bankCode": "JSB",
                    "bankName": "JANATA SAHAKARI BANK LTD"
                },
                {
                    "bankCode": "KAC",
                    "bankName": "THE KANGRA CENTRAL COOP BANK LTD"
                },
                {
                    "bankCode": "KAI",
                    "bankName": "KALLAPPANNA AWADE ICH JANATA S BANK"
                },
                {
                    "bankCode": "KAN",
                    "bankName": "THE KANGRA COOPERATIVE BANK LTD"
                },
                {
                    "bankCode": "KAR",
                    "bankName": "KARNATAKA BANK LTD"
                },
                {
                    "bankCode": "KCB",
                    "bankName": "THE KAPOL COOP BANK LTD"
                },
                {
                    "bankCode": "KCC",
                    "bankName": "KALUPUR COOP BANK"
                },
                {
                    "bankCode": "KJS",
                    "bankName": "KALYAN JANATA SAHAKARI BANK LTD"
                },
                {
                    "bankCode": "KKB",
                    "bankName": "KOTAK MAHINDRA BANK"
                },
                {
                    "bankCode": "KNS",
                    "bankName": "KURMANCHAL NAGAR SAHKARI BANK LTD"
                },
                {
                    "bankCode": "KRT",
                    "bankName": "KRUNG THAI BANK PCL"
                },
                {
                    "bankCode": "KSC",
                    "bankName": "KARNATAKA STATE COOP APEX BANK"
                },
                {
                    "bankCode": "KUC",
                    "bankName": "THE KARAD URBAN COOP BANK LTD"
                },
                {
                    "bankCode": "KVB",
                    "bankName": "KARUR VYSYA BANK"
                },
                {
                    "bankCode": "KVG",
                    "bankName": "KARNATAKA VIKAS GRAMEENA BANK"
                },
                {
                    "bankCode": "LAV",
                    "bankName": "THE LAKSHMI VILAS BANK LTD"
                },
                {
                    "bankCode": "MAH",
                    "bankName": "BANK OF MAHARASHTRA"
                },
                {
                    "bankCode": "MCB",
                    "bankName": "THE MAHANAGAR CO OP BANK LTD"
                },
                {
                    "bankCode": "MCX",
                    "bankName": "MCX SX CLEARING CORPORATION LTD"
                },
                {
                    "bankCode": "MDC",
                    "bankName": "THE MDCC BANK LTD"
                },
                {
                    "bankCode": "MHC",
                    "bankName": "MIZUHO CORPORATE BANK LTD"
                },
                {
                    "bankCode": "MSC",
                    "bankName": "MAHARASHTRA STATE COOP BANK LTD"
                },
                {
                    "bankCode": "MSH",
                    "bankName": "MASHREQBANK PSC"
                },
                {
                    "bankCode": "MSN",
                    "bankName": "THE MEHSANA URBAN COOP BANK"
                },
                {
                    "bankCode": "MSP",
                    "bankName": "MORGAN STANLEY INDIA PRIMARY DEALER"
                },
                {
                    "bankCode": "MUB",
                    "bankName": "THE MUNICIPAL COOP BANK LTD"
                },
                {
                    "bankCode": "NAT",
                    "bankName": "NATIONAL AUSTRALIA BANK LTD"
                },
                {
                    "bankCode": "NFI",
                    "bankName": "NOMURA FIXED INCOME SECURITIES PVT"
                },
                {
                    "bankCode": "NGS",
                    "bankName": "NAGPUR NAGARIK SAHAKARI BANK LTD"
                },
                {
                    "bankCode": "NIC",
                    "bankName": "NEW INDIA COOP BANK LTD"
                },
                {
                    "bankCode": "NKG",
                    "bankName": "NKGSB COOP BANK LTD"
                },
                {
                    "bankCode": "NMC",
                    "bankName": "NASIK MERCHANTS COOP BANK"
                },
                {
                    "bankCode": "NMG",
                    "bankName": "NORTHMALABAR GRAMIN BANK"
                },
                {
                    "bankCode": "NNS",
                    "bankName": "NUTAN NAGARIK SAHAKARI BANK LTD"
                },
                {
                    "bankCode": "NOS",
                    "bankName": "THE BANK OF NOVA SCOTIA"
                },
                {
                    "bankCode": "NPC",
                    "bankName": "NATIONAL PAYMENTS CORPORATION OF IN"
                },
                {
                    "bankCode": "NTB",
                    "bankName": "THE NAINITAL BANK LTD"
                },
                {
                    "bankCode": "NUC",
                    "bankName": "NAGAR URBAN COOPERATIVE BANK LTD."
                },
                {
                    "bankCode": "OIB",
                    "bankName": "HSBC BANK OMAN SAOG"
                },
                {
                    "bankCode": "ORB",
                    "bankName": "ORIENTAL BANK OF COMMERCE"
                },
                {
                    "bankCode": "ORC",
                    "bankName": "ORISSA STATE CO OP BANK LTD"
                },
                {
                    "bankCode": "PJS",
                    "bankName": "PARSIK JANATA SAHAKARI BANK LTD"
                },
                {
                    "bankCode": "PMC",
                    "bankName": "PUNJAB AND MAHARSHTRA COOP BANK"
                },
                {
                    "bankCode": "PME",
                    "bankName": "PRIME COOP BANK LTD"
                },
                {
                    "bankCode": "PNB",
                    "bankName": "PNB GILTS LIMITED"
                },
                {
                    "bankCode": "PRT",
                    "bankName": "PRATHAMA BANK"
                },
                {
                    "bankCode": "PSI",
                    "bankName": "PUNJAB AND SIND BANK"
                },
                {
                    "bankCode": "PUN",
                    "bankName": "PUNJAB NATIONAL BANK"
                },
                {
                    "bankCode": "RAB",
                    "bankName": "RABOBANK INTERNATIONAL"
                },
                {
                    "bankCode": "RAT",
                    "bankName": "THE RATNAKAR BANK LTD"
                },
                {
                    "bankCode": "RBI",
                    "bankName": "IDRBT"
                },
                {
                    "bankCode": "RNS",
                    "bankName": "RAJKOT NAGRIK SAHAKARI BANK LTD"
                },
                {
                    "bankCode": "RSC",
                    "bankName": "THE RAJASTHAN STATE COOP BANK LTD"
                },
                {
                    "bankCode": "SAB",
                    "bankName": "SBERBANK"
                },
                {
                    "bankCode": "SAH",
                    "bankName": "SAHEBRAO DESHMUKH COOP BANK LTD"
                },
                {
                    "bankCode": "SBB",
                    "bankName": "STATE BANK OF BIKANER AND JAIPUR"
                },
                {
                    "bankCode": "SBD",
                    "bankName": "SBI DFHI LTD"
                },
                {
                    "bankCode": "SBH",
                    "bankName": "STATE BANK OF HYDERABAD"
                },
                {
                    "bankCode": "SBI",
                    "bankName": "STATE BANK OF INDIA"
                },
                {
                    "bankCode": "SBM",
                    "bankName": "STATE BANK OF MYSORE"
                },
                {
                    "bankCode": "SBT",
                    "bankName": "STATE BANK OF TRAVANCORE"
                },
                {
                    "bankCode": "SCB",
                    "bankName": "STANDARD CHARTERED BANK"
                },
                {
                    "bankCode": "SDC",
                    "bankName": "THE SURAT DIST COOP BANK LTD"
                },
                {
                    "bankCode": "SHB",
                    "bankName": "SHINHAN BANK"
                },
                {
                    "bankCode": "SIB",
                    "bankName": "SOUTH INDIAN BANK LTD"
                },
                {
                    "bankCode": "SJS",
                    "bankName": "SOLAPUR JANATA SAHAKARI BANK LTD"
                },
                {
                    "bankCode": "SMB",
                    "bankName": "SUMITOMO MITSUI BANKING CORPORATION"
                },
                {
                    "bankCode": "SOG",
                    "bankName": "SOCIETE GENERALE"
                },
                {
                    "bankCode": "SPC",
                    "bankName": "THE SURAT PEOPLES COOP BANK LTD"
                },
                {
                    "bankCode": "SRC",
                    "bankName": "THE SARASWAT COOP BANK LTD"
                },
                {
                    "bankCode": "STB",
                    "bankName": "STATE BANK OF PATIALA"
                },
                {
                    "bankCode": "STC",
                    "bankName": "SEC TRADING CORP OF INDIA LTD."
                },
                {
                    "bankCode": "SUT",
                    "bankName": "THE SUTEX COOP BANK LIMITED"
                },
                {
                    "bankCode": "SVB",
                    "bankName": "THE SEVA VIKAS COOP BANK LTD"
                },
                {
                    "bankCode": "SVC",
                    "bankName": "SHAMRAO VITHAL COOP BANK LTD"
                },
                {
                    "bankCode": "SYN",
                    "bankName": "SYNDICATE BANK"
                },
                {
                    "bankCode": "TBS",
                    "bankName": "THANE BHARAT SAHAKARI BANK LTD"
                },
                {
                    "bankCode": "TDC",
                    "bankName": "THANE DIST CENTRAL COOP BANK LTD"
                },
                {
                    "bankCode": "TGM",
                    "bankName": "TGMC BANK LTD"
                },
                {
                    "bankCode": "TJS",
                    "bankName": "THANE JANATA SAHKARI BANK LTD"
                },
                {
                    "bankCode": "TMB",
                    "bankName": "TAMILNAD MERCANTILE BANK LTD"
                },
                {
                    "bankCode": "TNS",
                    "bankName": "THE TAMIL NADU STATE APEX COOP BANK"
                },
                {
                    "bankCode": "UBI",
                    "bankName": "UNION BANK OF INDIA"
                },
                {
                    "bankCode": "UBS",
                    "bankName": "UBS AG"
                },
                {
                    "bankCode": "UCB",
                    "bankName": "UCO BANK"
                },
                {
                    "bankCode": "UTB",
                    "bankName": "UNITED BANK OF INDIA"
                },
                {
                    "bankCode": "UTI",
                    "bankName": "AXIS BANK"
                },
                {
                    "bankCode": "VAR",
                    "bankName": "THE VARACHHA COOP BANK LTD"
                },
                {
                    "bankCode": "VIJ",
                    "bankName": "VIJAYA BANK"
                },
                {
                    "bankCode": "VSB",
                    "bankName": "THE VISHWESHWAR SAHAKARI BANK LTD"
                },
                {
                    "bankCode": "VVS",
                    "bankName": "VASAI VIKAS SAHAKARI BANK LIMITED"
                },
                {
                    "bankCode": "VYS",
                    "bankName": "ING VYSYA BANK"
                },
                {
                    "bankCode": "WBS",
                    "bankName": "THE WEST BENGAL STATE COOP BANK LTD"
                },
                {
                    "bankCode": "WPA",
                    "bankName": "WESTPAC BANKING CORPORATION"
                },
                {
                    "bankCode": "XNS",
                    "bankName": "NATIONAL STOCK EXCHANGE OF INDIA LT"
                },
                {
                    "bankCode": "YES",
                    "bankName": "YES BANK"
                },
                {
                    "bankCode": "IDF",
                    "bankName": "IDFC BANK"
                },
                {
                    "bankCode": "JPC",
                    "bankName": "THE JALGAON PEOPLES COOP BANK LTD"
                },
                {
                    "bankCode": "SVB",
                    "bankName": "THE SEVA VIKAS COOP BANK LTD"
                },
                {
                    "bankCode": "CRE",
                    "bankName": "CREDIT SUISSE AG"
                },
                {
                    "bankCode": "PME",
                    "bankName": "PRIME COOP BANK LTD"
                },
                {
                    "bankCode": "AUC",
                    "bankName": "ALMORA URBAN COOP BANK LTD"
                },
                {
                    "bankCode": "ADC",
                    "bankName": "AKOLA DISTRICT CENTRAL COOP BANK"
                },
                {
                    "bankCode": "EIB",
                    "bankName": "EXPORT IMPORT BANK OF INDIA"
                },
                {
                    "bankCode": "MCB",
                    "bankName": "THE MAHANAGAR CO OP BANK LTD"
                },
                {
                    "bankCode": "TGM",
                    "bankName": "TGMC BANK LTD"
                },
                {
                    "bankCode": "NTB",
                    "bankName": "THE NAINITAL BANK LTD"
                },
                {
                    "bankCode": "AND",
                    "bankName": "ANDHRA BANK"
                },
                {
                    "bankCode": "BBK",
                    "bankName": "BANK OF BAHRAIN AND KUWAIT B S C"
                },
                {
                    "bankCode": "BCB",
                    "bankName": "BHARAT COOP BANK MUMBAI LTD"
                },
                {
                    "bankCode": "NKG",
                    "bankName": "NKGSB COOP BANK LTD"
                },
                {
                    "bankCode": "PMC",
                    "bankName": "PUNJAB AND MAHARSHTRA COOP BANK"
                },
                {
                    "bankCode": "IBK",
                    "bankName": "IDBI BANK LTD"
                },
                {
                    "bankCode": "MSN",
                    "bankName": "THE MEHSANA URBAN COOP BANK"
                },
                {
                    "bankCode": "FIR",
                    "bankName": "FIRSTRAND BANK LTD"
                },
                {
                    "bankCode": "PRT",
                    "bankName": "PRATHAMA BANK"
                },
                {
                    "bankCode": "PNB",
                    "bankName": "PNB GILTS LIMITED"
                },
                {
                    "bankCode": "HDF",
                    "bankName": "HDFC BANK"
                },
                {
                    "bankCode": "VYS",
                    "bankName": "ING VYSYA BANK"
                },
                {
                    "bankCode": "SRC",
                    "bankName": "THE SARASWAT COOP BANK LTD"
                },
                {
                    "bankCode": "CRL",
                    "bankName": "CREDIT AGRICOLE CORP N INVSMNT BANK"
                },
                {
                    "bankCode": "IND",
                    "bankName": "INDUSIND BANK"
                },
                {
                    "bankCode": "KSC",
                    "bankName": "KARNATAKA STATE COOP APEX BANK"
                },
                {
                    "bankCode": "UBS",
                    "bankName": "UBS AG"
                },
                {
                    "bankCode": "CRU",
                    "bankName": "SHRI CHHATRAPATI RAJ SHAHU UCB LTD"
                },
                {
                    "bankCode": "GSC",
                    "bankName": "THE GUJARAT STATE COOP BANK"
                },
                {
                    "bankCode": "VVS",
                    "bankName": "VASAI VIKAS SAHAKARI BANK LIMITED"
                },
                {
                    "bankCode": "RAT",
                    "bankName": "THE RATNAKAR BANK LTD"
                },
                {
                    "bankCode": "FDR",
                    "bankName": "FEDERAL BANK LTD"
                },
                {
                    "bankCode": "SHB",
                    "bankName": "SHINHAN BANK"
                },
                {
                    "bankCode": "DIC",
                    "bankName": "DEPOSIT INS AND CR GUAR CORPN"
                },
                {
                    "bankCode": "KUC",
                    "bankName": "THE KARAD URBAN COOP BANK LTD"
                },
                {
                    "bankCode": "APM",
                    "bankName": "THE A P MAHESH CO OP URBAN BANK"
                },
                {
                    "bankCode": "SVC",
                    "bankName": "SHAMRAO VITHAL COOP BANK LTD"
                },
                {
                    "bankCode": "RNS",
                    "bankName": "RAJKOT NAGRIK SAHAKARI BANK LTD"
                },
                {
                    "bankCode": "TNS",
                    "bankName": "THE TAMIL NADU STATE APEX COOP BANK"
                },
                {
                    "bankCode": "KCC",
                    "bankName": "KALUPUR COOP BANK"
                },
                {
                    "bankCode": "BOT",
                    "bankName": "THE BANK OF TOKYO MITSUBISHI LTD"
                },
                {
                    "bankCode": "LAV",
                    "bankName": "THE LAKSHMI VILAS BANK LTD"
                },
                {
                    "bankCode": "CHA",
                    "bankName": "JPMORGAN CHASE BANK"
                },
                {
                    "bankCode": "CIT",
                    "bankName": "CITI BANK"
                },
                {
                    "bankCode": "DBS",
                    "bankName": "DEVELOPMENT BANK OF SINGAPORE"
                },
                {
                    "bankCode": "CTC",
                    "bankName": "CHINATRUST COMMERCIAL BANK LTD"
                },
                {
                    "bankCode": "SOG",
                    "bankName": "SOCIETE GENERALE"
                },
                {
                    "bankCode": "SIB",
                    "bankName": "SOUTH INDIAN BANK LTD"
                },
                {
                    "bankCode": "JAN",
                    "bankName": "JANASEVA SAHAKARI BANK LTD"
                },
                {
                    "bankCode": "SAB",
                    "bankName": "SBERBANK"
                },
                {
                    "bankCode": "MHC",
                    "bankName": "MIZUHO CORPORATE BANK LTD"
                },
                {
                    "bankCode": "ICL",
                    "bankName": "INDIAN CLEARING CORPORATION LIMITED"
                },
                {
                    "bankCode": "ISE",
                    "bankName": "ICICI SECURITIES LIMITED"
                },
                {
                    "bankCode": "NUC",
                    "bankName": "NAGAR URBAN COOPERATIVE BANK LTD"
                },
                {
                    "bankCode": "OIB",
                    "bankName": "HSBC BANK OMAN SAOG"
                },
                {
                    "bankCode": "WBS",
                    "bankName": "THE WEST BENGAL STATE COOP BANK LTD"
                },
                {
                    "bankCode": "KJS",
                    "bankName": "KALYAN JANATA SAHAKARI BANK LTD"
                },
                {
                    "bankCode": "AMC",
                    "bankName": "AHMEDABAD MERCANTILE COOP BANK"
                },
                {
                    "bankCode": "MDC",
                    "bankName": "THE MDCC BANK LTD"
                },
                {
                    "bankCode": "BNP",
                    "bankName": "BNP PARIBAS"
                },
                {
                    "bankCode": "NNS",
                    "bankName": "NUTAN NAGARIK SAHAKARI BANK LTD"
                },
                {
                    "bankCode": "NAT",
                    "bankName": "NATIONAL AUSTRALIA BANK LTD"
                },
                {
                    "bankCode": "VSB",
                    "bankName": "THE VISHWESHWAR SAHAKARI BANK LTD"
                },
                {
                    "bankCode": "RSC",
                    "bankName": "THE RAJASTHAN STATE COOP BANK LTD"
                },
                {
                    "bankCode": "KVG",
                    "bankName": "KARNATAKA VIKAS GRAMEENA BANK"
                },
                {
                    "bankCode": "VAR",
                    "bankName": "THE VARACHHA COOP BANK LTD"
                },
                {
                    "bankCode": "KAN",
                    "bankName": "THE KANGRA COOPERATIVE BANK LTD"
                },
                {
                    "bankCode": "HVB",
                    "bankName": "WOORI BANK"
                },
                {
                    "bankCode": "TDC",
                    "bankName": "THANE DIST CENTRAL COOP BANK LTD"
                },
                {
                    "bankCode": "KAC",
                    "bankName": "THE KANGRA CENTRAL COOP BANK LTD"
                },
                {
                    "bankCode": "SMB",
                    "bankName": "SUMITOMO MITSUI BANKING CORPORATION"
                },
                {
                    "bankCode": "NMG",
                    "bankName": "NORTHMALABAR GRAMIN BANK"
                },
                {
                    "bankCode": "YES",
                    "bankName": "YES BANK"
                },
                {
                    "bankCode": "NIC",
                    "bankName": "NEW INDIA COOP BANK LTD"
                },
                {
                    "bankCode": "BKD",
                    "bankName": "DENA BANK"
                },
                {
                    "bankCode": "JAK",
                    "bankName": "JAMMU AND KASHMIR BANK LTD"
                },
                {
                    "bankCode": "BAR",
                    "bankName": "BANK OF BARODA"
                },
                {
                    "bankCode": "PSI",
                    "bankName": "PUNJAB AND SIND BANK"
                },
                {
                    "bankCode": "GBC",
                    "bankName": "THE GREATER BOMBAY COOP BANK LTD"
                },
                {
                    "bankCode": "RBI",
                    "bankName": "IDRBT"
                },
                {
                    "bankCode": "DCB",
                    "bankName": "DEVELOPMENT CREDIT BANK"
                },
                {
                    "bankCode": "DEU",
                    "bankName": "DEUSTCHE BANK"
                },
                {
                    "bankCode": "KVB",
                    "bankName": "KARUR VYSYA BANK"
                },
                {
                    "bankCode": "DNS",
                    "bankName": "DNS BANK LTD"
                },
                {
                    "bankCode": "ICB",
                    "bankName": "INDUSTRIAL AND COMMERCIAL BANK OF C"
                },
                {
                    "bankCode": "KRT",
                    "bankName": "KRUNG THAI BANK PCL"
                },
                {
                    "bankCode": "SUT",
                    "bankName": "THE SUTEX COOP BANK LIMITED"
                },
                {
                    "bankCode": "CLB",
                    "bankName": "CAPITAL LOCAL AREA BANK LTD"
                },
                {
                    "bankCode": "KNS",
                    "bankName": "KURMANCHAL NAGAR SAHKARI BANK LTD"
                },
                {
                    "bankCode": "GDC",
                    "bankName": "THE GDCC BANK LTD"
                },
                {
                    "bankCode": "IBB",
                    "bankName": "BANK INTERNATIONAL INDONESIA"
                },
                {
                    "bankCode": "CCI",
                    "bankName": "THE CLEARING COOP OF INDIA LTD"
                },
                {
                    "bankCode": "DSI",
                    "bankName": "DEUTSCHE SECURITIES INDIA PVT LTD"
                },
                {
                    "bankCode": "PUN",
                    "bankName": "PUNJAB NATIONAL BANK"
                },
                {
                    "bankCode": "COS",
                    "bankName": "THE COSMOS COOP BANK LTD"
                },
                {
                    "bankCode": "UBI",
                    "bankName": "UNION BANK OF INDIA"
                },
                {
                    "bankCode": "ABN",
                    "bankName": "THE ROYAL BANK OF SCOTLAND N V"
                },
                {
                    "bankCode": "CBI",
                    "bankName": "CENTRAL BANK OF INDIA"
                },
                {
                    "bankCode": "VIJ",
                    "bankName": "VIJAYA BANK"
                },
                {
                    "bankCode": "ICI",
                    "bankName": "ICICI BANK LTD"
                },
                {
                    "bankCode": "TJS",
                    "bankName": "THANE JANATA SAHKARI BANK LTD"
                },
                {
                    "bankCode": "JSB",
                    "bankName": "JANATA SAHAKARI BANK LTD"
                },
                {
                    "bankCode": "NMC",
                    "bankName": "NASIK MERCHANTS COOP BANK"
                },
                {
                    "bankCode": "JJS",
                    "bankName": "JALGAON JANATA SAHKARI BANK LTD"
                },
                {
                    "bankCode": "ANZ",
                    "bankName": "AUSTRALIA NEWZELAND BANK GROUP LTD"
                },
                {
                    "bankCode": "CTB",
                    "bankName": "COMMONWEALTH BANK OF AUSTRALIA"
                },
                {
                    "bankCode": "APB",
                    "bankName": "THE AP STATE COOP BANK LTD"
                },
                {
                    "bankCode": "SBD",
                    "bankName": "SBI DFHI LTD"
                },
                {
                    "bankCode": "STC",
                    "bankName": "SEC TRADING CORP OF INDIA LTD."
                },
                {
                    "bankCode": "MCX",
                    "bankName": "MCX SX CLEARING CORPORATION LTD"
                },
                {
                    "bankCode": "NPC",
                    "bankName": "NATIONAL PAYMENTS CORPORATION OF IN"
                },
                {
                    "bankCode": "CCB",
                    "bankName": "CITIZEN CREDIT COOP BANK LTD"
                },
                {
                    "bankCode": "STB",
                    "bankName": "STATE BANK OF PATIALA"
                },
                {
                    "bankCode": "UCB",
                    "bankName": "UCO BANK"
                },
                {
                    "bankCode": "TMB",
                    "bankName": "TAMILNAD MERCANTILE BANK LTD"
                },
                {
                    "bankCode": "SYN",
                    "bankName": "SYNDICATE BANK"
                },
                {
                    "bankCode": "BCE",
                    "bankName": "BANK OF CEYLON"
                },
                {
                    "bankCode": "KAI",
                    "bankName": "KALLAPPANNA AWADE ICH JANATA S BANK"
                },
                {
                    "bankCode": "RAB",
                    "bankName": "RABOBANK INTERNATIONAL"
                },
                {
                    "bankCode": "APG",
                    "bankName": "ANDHRA PRAGATHI GRAMEENA BANK"
                },
                {
                    "bankCode": "SAH",
                    "bankName": "SAHEBRAO DESHMUKH COOP BANK LTD"
                },
                {
                    "bankCode": "GGB",
                    "bankName": "GURGAON GRAMIN BANK"
                },
                {
                    "bankCode": "HSB",
                    "bankName": "HSBC BANK"
                },
                {
                    "bankCode": "GSI",
                    "bankName": "GOLDMAN SACH (INDIA) CAPITAL MARKET"
                },
                {
                    "bankCode": "NFI",
                    "bankName": "NOMURA FIXED INCOME SECURITIES PVT"
                },
                {
                    "bankCode": "ALL",
                    "bankName": "ALLAHABAD BANK"
                },
                {
                    "bankCode": "SBT",
                    "bankName": "STATE BANK OF TRAVANCORE"
                },
                {
                    "bankCode": "SBI",
                    "bankName": "STATE BANK OF INDIA"
                },
                {
                    "bankCode": "NOS",
                    "bankName": "THE BANK OF NOVA SCOTIA"
                },
                {
                    "bankCode": "MSC",
                    "bankName": "MAHARASHTRA STATE COOP BANK LTD"
                },
                {
                    "bankCode": "SBH",
                    "bankName": "STATE BANK OF HYDERABAD"
                },
                {
                    "bankCode": "BAC",
                    "bankName": "BASSEIN CATHOLIC COOP BANK LTD"
                },
                {
                    "bankCode": "SPC",
                    "bankName": "THE SURAT PEOPLES COOP BANK LTD"
                },
                {
                    "bankCode": "TBS",
                    "bankName": "THANE BHARAT SAHAKARI BANK LTD"
                },
                {
                    "bankCode": "NGS",
                    "bankName": "NAGPUR NAGARIK SAHAKARI BANK LTD"
                },
                {
                    "bankCode": "SDC",
                    "bankName": "THE SURAT DIST COOP BANK LTD"
                },
                {
                    "bankCode": "MUB",
                    "bankName": "THE MUNICIPAL COOP BANK LTD"
                },
                {
                    "bankCode": "CIU",
                    "bankName": "CITY UNION BANK LTD"
                },
                {
                    "bankCode": "KAR",
                    "bankName": "KARNATAKA BANK LTD"
                },
                {
                    "bankCode": "COR",
                    "bankName": "CORPORATION BANK"
                },
                {
                    "bankCode": "IDI",
                    "bankName": "INDIAN BANK"
                },
                {
                    "bankCode": "BOF",
                    "bankName": "BANK OF AMERICA"
                },
                {
                    "bankCode": "UTI",
                    "bankName": "AXIS BANK"
                },
                {
                    "bankCode": "SCB",
                    "bankName": "STANDARD CHARTERED BANK"
                },
                {
                    "bankCode": "ORC",
                    "bankName": "ORISSA STATE CO OP BANK LTD"
                },
                {
                    "bankCode": "CNR",
                    "bankName": "CANARA BANK"
                },
                {
                    "bankCode": "ORB",
                    "bankName": "ORIENTAL BANK OF COMMERCE"
                },
                {
                    "bankCode": "MAH",
                    "bankName": "BANK OF MAHARASHTRA"
                },
                {
                    "bankCode": "IOB",
                    "bankName": "INDIAN OVERSEAS BANK"
                },
                {
                    "bankCode": "SBM",
                    "bankName": "STATE BANK OF MYSORE"
                },
                {
                    "bankCode": "SBB",
                    "bankName": "STATE BANK OF BIKANER AND JAIPUR"
                },
                {
                    "bankCode": "CSB",
                    "bankName": "CATHOLIC SYRIAN BANK LTD"
                },
                {
                    "bankCode": "MSH",
                    "bankName": "MASHREQBANK PSC"
                },
                {
                    "bankCode": "KCB",
                    "bankName": "THE KAPOL COOP BANK LTD"
                },
                {
                    "bankCode": "UTB",
                    "bankName": "UNITED BANK OF INDIA"
                },
                {
                    "bankCode": "ASB",
                    "bankName": "APNA SAHAKARI BANK LTD"
                },
                {
                    "bankCode": "PJS",
                    "bankName": "PARSIK JANATA SAHAKARI BANK LTD"
                },
                {
                    "bankCode": "WPA",
                    "bankName": "WESTPAC BANKING CORPORATION"
                },
                {
                    "bankCode": "ABH",
                    "bankName": "ABHYUDAYA CO OP BANK LTD"
                },
                {
                    "bankCode": "SJS",
                    "bankName": "SOLAPUR JANATA SAHAKARI BANK LTD"
                },
                {
                    "bankCode": "AKJ",
                    "bankName": "AKOLA JANATA COMMERCIAL COOP BANK"
                },
                {
                    "bankCode": "XNS",
                    "bankName": "NATIONAL STOCK EXCHANGE OF INDIA LT"
                },
                {
                    "bankCode": "JAS",
                    "bankName": "JANASEVA SAHAKARI BANK (BORIVLI) LT"
                },
                {
                    "bankCode": "MSP",
                    "bankName": "MORGAN STANLEY INDIA PRIMARY DEALER"
                },
                {
                    "bankCode": "BKI",
                    "bankName": "BANK OF INDIA"
                },
                {
                    "bankCode": "KKB",
                    "bankName": "KOTAK MAHINDRA BANK"
                },
                {
                    "bankCode": "DLX",
                    "bankName": "THE DHANALAKSHMI BANK LTD"
                },
                {
                    "bankCode": "JPC",
                    "bankName": "THE JALGAON PEOPLES COOP BANK LTD"
                },
                {
                    "bankCode": "SVB",
                    "bankName": "THE SEVA VIKAS COOP BANK LTD"
                },
                {
                    "bankCode": "CRE",
                    "bankName": "CREDIT SUISSE AG"
                },
                {
                    "bankCode": "PME",
                    "bankName": "PRIME COOP BANK LTD"
                },
                {
                    "bankCode": "AUC",
                    "bankName": "ALMORA URBAN COOP BANK LTD"
                },
                {
                    "bankCode": "ADC",
                    "bankName": "AKOLA DISTRICT CENTRAL COOP BANK"
                },
                {
                    "bankCode": "EIB",
                    "bankName": "EXPORT IMPORT BANK OF INDIA"
                },
                {
                    "bankCode": "MCB",
                    "bankName": "THE MAHANAGAR CO OP BANK LTD"
                },
                {
                    "bankCode": "TGM",
                    "bankName": "TGMC BANK LTD"
                },
                {
                    "bankCode": "NTB",
                    "bankName": "THE NAINITAL BANK LTD"
                },
                {
                    "bankCode": "AND",
                    "bankName": "ANDHRA BANK"
                },
                {
                    "bankCode": "BBK",
                    "bankName": "BANK OF BAHRAIN AND KUWAIT B S C"
                },
                {
                    "bankCode": "BCB",
                    "bankName": "BHARAT COOP BANK MUMBAI LTD"
                },
                {
                    "bankCode": "NKG",
                    "bankName": "NKGSB COOP BANK LTD"
                },
                {
                    "bankCode": "PMC",
                    "bankName": "PUNJAB AND MAHARSHTRA COOP BANK"
                },
                {
                    "bankCode": "IBK",
                    "bankName": "IDBI BANK LTD"
                },
                {
                    "bankCode": "MSN",
                    "bankName": "THE MEHSANA URBAN COOP BANK"
                },
                {
                    "bankCode": "FIR",
                    "bankName": "FIRSTRAND BANK LTD"
                },
                {
                    "bankCode": "PRT",
                    "bankName": "PRATHAMA BANK"
                },
                {
                    "bankCode": "PNB",
                    "bankName": "PNB GILTS LIMITED"
                },
                {
                    "bankCode": "HDF",
                    "bankName": "HDFC BANK"
                },
                {
                    "bankCode": "VYS",
                    "bankName": "ING VYSYA BANK"
                },
                {
                    "bankCode": "SRC",
                    "bankName": "THE SARASWAT COOP BANK LTD"
                },
                {
                    "bankCode": "CRL",
                    "bankName": "CREDIT AGRICOLE CORP N INVSMNT BANK"
                },
                {
                    "bankCode": "IND",
                    "bankName": "INDUSIND BANK"
                },
                {
                    "bankCode": "KSC",
                    "bankName": "KARNATAKA STATE COOP APEX BANK"
                },
                {
                    "bankCode": "UBS",
                    "bankName": "UBS AG"
                },
                {
                    "bankCode": "CRU",
                    "bankName": "SHRI CHHATRAPATI RAJ SHAHU UCB LTD"
                },
                {
                    "bankCode": "GSC",
                    "bankName": "THE GUJARAT STATE COOP BANK"
                },
                {
                    "bankCode": "VVS",
                    "bankName": "VASAI VIKAS SAHAKARI BANK LIMITED"
                },
                {
                    "bankCode": "RAT",
                    "bankName": "THE RATNAKAR BANK LTD"
                },
                {
                    "bankCode": "FDR",
                    "bankName": "FEDERAL BANK LTD"
                },
                {
                    "bankCode": "SHB",
                    "bankName": "SHINHAN BANK"
                },
                {
                    "bankCode": "DIC",
                    "bankName": "DEPOSIT INS AND CR GUAR CORPN"
                },
                {
                    "bankCode": "KUC",
                    "bankName": "THE KARAD URBAN COOP BANK LTD"
                },
                {
                    "bankCode": "APM",
                    "bankName": "THE A P MAHESH CO OP URBAN BANK"
                },
                {
                    "bankCode": "SVC",
                    "bankName": "SHAMRAO VITHAL COOP BANK LTD"
                },
                {
                    "bankCode": "RNS",
                    "bankName": "RAJKOT NAGRIK SAHAKARI BANK LTD"
                },
                {
                    "bankCode": "TNS",
                    "bankName": "THE TAMIL NADU STATE APEX COOP BANK"
                },
                {
                    "bankCode": "KCC",
                    "bankName": "KALUPUR COOP BANK"
                },
                {
                    "bankCode": "BOT",
                    "bankName": "THE BANK OF TOKYO MITSUBISHI LTD"
                },
                {
                    "bankCode": "LAV",
                    "bankName": "THE LAKSHMI VILAS BANK LTD"
                },
                {
                    "bankCode": "CHA",
                    "bankName": "JPMORGAN CHASE BANK"
                },
                {
                    "bankCode": "CIT",
                    "bankName": "CITI BANK"
                },
                {
                    "bankCode": "DBS",
                    "bankName": "DEVELOPMENT BANK OF SINGAPORE"
                },
                {
                    "bankCode": "CTC",
                    "bankName": "CHINATRUST COMMERCIAL BANK LTD"
                },
                {
                    "bankCode": "SOG",
                    "bankName": "SOCIETE GENERALE"
                },
                {
                    "bankCode": "SIB",
                    "bankName": "SOUTH INDIAN BANK LTD"
                },
                {
                    "bankCode": "JAN",
                    "bankName": "JANASEVA SAHAKARI BANK LTD"
                },
                {
                    "bankCode": "SAB",
                    "bankName": "SBERBANK"
                },
                {
                    "bankCode": "MHC",
                    "bankName": "MIZUHO CORPORATE BANK LTD"
                },
                {
                    "bankCode": "ICL",
                    "bankName": "INDIAN CLEARING CORPORATION LIMITED"
                },
                {
                    "bankCode": "ISE",
                    "bankName": "ICICI SECURITIES LIMITED"
                },
                {
                    "bankCode": "NUC",
                    "bankName": "NAGAR URBAN COOPERATIVE BANK LTD"
                },
                {
                    "bankCode": "OIB",
                    "bankName": "HSBC BANK OMAN SAOG"
                },
                {
                    "bankCode": "WBS",
                    "bankName": "THE WEST BENGAL STATE COOP BANK LTD"
                },
                {
                    "bankCode": "KJS",
                    "bankName": "KALYAN JANATA SAHAKARI BANK LTD"
                },
                {
                    "bankCode": "AMC",
                    "bankName": "AHMEDABAD MERCANTILE COOP BANK"
                },
                {
                    "bankCode": "MDC",
                    "bankName": "THE MDCC BANK LTD"
                },
                {
                    "bankCode": "BNP",
                    "bankName": "BNP PARIBAS"
                },
                {
                    "bankCode": "NNS",
                    "bankName": "NUTAN NAGARIK SAHAKARI BANK LTD"
                },
                {
                    "bankCode": "NAT",
                    "bankName": "NATIONAL AUSTRALIA BANK LTD"
                },
                {
                    "bankCode": "VSB",
                    "bankName": "THE VISHWESHWAR SAHAKARI BANK LTD"
                },
                {
                    "bankCode": "RSC",
                    "bankName": "THE RAJASTHAN STATE COOP BANK LTD"
                },
                {
                    "bankCode": "KVG",
                    "bankName": "KARNATAKA VIKAS GRAMEENA BANK"
                },
                {
                    "bankCode": "VAR",
                    "bankName": "THE VARACHHA COOP BANK LTD"
                },
                {
                    "bankCode": "KAN",
                    "bankName": "THE KANGRA COOPERATIVE BANK LTD"
                },
                {
                    "bankCode": "HVB",
                    "bankName": "WOORI BANK"
                },
                {
                    "bankCode": "TDC",
                    "bankName": "THANE DIST CENTRAL COOP BANK LTD"
                },
                {
                    "bankCode": "KAC",
                    "bankName": "THE KANGRA CENTRAL COOP BANK LTD"
                },
                {
                    "bankCode": "SMB",
                    "bankName": "SUMITOMO MITSUI BANKING CORPORATION"
                },
                {
                    "bankCode": "NMG",
                    "bankName": "NORTHMALABAR GRAMIN BANK"
                },
                {
                    "bankCode": "YES",
                    "bankName": "YES BANK"
                },
                {
                    "bankCode": "NIC",
                    "bankName": "NEW INDIA COOP BANK LTD"
                },
                {
                    "bankCode": "BKD",
                    "bankName": "DENA BANK"
                },
                {
                    "bankCode": "JAK",
                    "bankName": "JAMMU AND KASHMIR BANK LTD"
                },
                {
                    "bankCode": "BAR",
                    "bankName": "BANK OF BARODA"
                },
                {
                    "bankCode": "PSI",
                    "bankName": "PUNJAB AND SIND BANK"
                },
                {
                    "bankCode": "GBC",
                    "bankName": "THE GREATER BOMBAY COOP BANK LTD"
                },
                {
                    "bankCode": "RBI",
                    "bankName": "IDRBT"
                },
                {
                    "bankCode": "DCB",
                    "bankName": "DEVELOPMENT CREDIT BANK"
                },
                {
                    "bankCode": "DEU",
                    "bankName": "DEUSTCHE BANK"
                },
                {
                    "bankCode": "KVB",
                    "bankName": "KARUR VYSYA BANK"
                },
                {
                    "bankCode": "DNS",
                    "bankName": "DNS BANK LTD"
                },
                {
                    "bankCode": "ICB",
                    "bankName": "INDUSTRIAL AND COMMERCIAL BANK OF C"
                },
                {
                    "bankCode": "KRT",
                    "bankName": "KRUNG THAI BANK PCL"
                },
                {
                    "bankCode": "SUT",
                    "bankName": "THE SUTEX COOP BANK LIMITED"
                },
                {
                    "bankCode": "CLB",
                    "bankName": "CAPITAL LOCAL AREA BANK LTD"
                },
                {
                    "bankCode": "KNS",
                    "bankName": "KURMANCHAL NAGAR SAHKARI BANK LTD"
                },
                {
                    "bankCode": "GDC",
                    "bankName": "THE GDCC BANK LTD"
                },
                {
                    "bankCode": "IBB",
                    "bankName": "BANK INTERNATIONAL INDONESIA"
                },
                {
                    "bankCode": "CCI",
                    "bankName": "THE CLEARING COOP OF INDIA LTD"
                },
                {
                    "bankCode": "DSI",
                    "bankName": "DEUTSCHE SECURITIES INDIA PVT LTD"
                },
                {
                    "bankCode": "PUN",
                    "bankName": "PUNJAB NATIONAL BANK"
                },
                {
                    "bankCode": "COS",
                    "bankName": "THE COSMOS COOP BANK LTD"
                },
                {
                    "bankCode": "UBI",
                    "bankName": "UNION BANK OF INDIA"
                },
                {
                    "bankCode": "ABN",
                    "bankName": "THE ROYAL BANK OF SCOTLAND N V"
                },
                {
                    "bankCode": "CBI",
                    "bankName": "CENTRAL BANK OF INDIA"
                },
                {
                    "bankCode": "VIJ",
                    "bankName": "VIJAYA BANK"
                },
                {
                    "bankCode": "ICI",
                    "bankName": "ICICI BANK LTD"
                },
                {
                    "bankCode": "TJS",
                    "bankName": "THANE JANATA SAHKARI BANK LTD"
                },
                {
                    "bankCode": "JSB",
                    "bankName": "JANATA SAHAKARI BANK LTD"
                },
                {
                    "bankCode": "NMC",
                    "bankName": "NASIK MERCHANTS COOP BANK"
                },
                {
                    "bankCode": "JJS",
                    "bankName": "JALGAON JANATA SAHKARI BANK LTD"
                },
                {
                    "bankCode": "ANZ",
                    "bankName": "AUSTRALIA NEWZELAND BANK GROUP LTD"
                },
                {
                    "bankCode": "CTB",
                    "bankName": "COMMONWEALTH BANK OF AUSTRALIA"
                },
                {
                    "bankCode": "APB",
                    "bankName": "THE AP STATE COOP BANK LTD"
                },
                {
                    "bankCode": "SBD",
                    "bankName": "SBI DFHI LTD"
                },
                {
                    "bankCode": "STC",
                    "bankName": "SEC TRADING CORP OF INDIA LTD."
                },
                {
                    "bankCode": "MCX",
                    "bankName": "MCX SX CLEARING CORPORATION LTD"
                },
                {
                    "bankCode": "NPC",
                    "bankName": "NATIONAL PAYMENTS CORPORATION OF IN"
                },
                {
                    "bankCode": "CCB",
                    "bankName": "CITIZEN CREDIT COOP BANK LTD"
                },
                {
                    "bankCode": "STB",
                    "bankName": "STATE BANK OF PATIALA"
                },
                {
                    "bankCode": "UCB",
                    "bankName": "UCO BANK"
                },
                {
                    "bankCode": "TMB",
                    "bankName": "TAMILNAD MERCANTILE BANK LTD"
                },
                {
                    "bankCode": "SYN",
                    "bankName": "SYNDICATE BANK"
                },
                {
                    "bankCode": "BCE",
                    "bankName": "BANK OF CEYLON"
                },
                {
                    "bankCode": "KAI",
                    "bankName": "KALLAPPANNA AWADE ICH JANATA S BANK"
                },
                {
                    "bankCode": "RAB",
                    "bankName": "RABOBANK INTERNATIONAL"
                },
                {
                    "bankCode": "APG",
                    "bankName": "ANDHRA PRAGATHI GRAMEENA BANK"
                },
                {
                    "bankCode": "SAH",
                    "bankName": "SAHEBRAO DESHMUKH COOP BANK LTD"
                },
                {
                    "bankCode": "GGB",
                    "bankName": "GURGAON GRAMIN BANK"
                },
                {
                    "bankCode": "HSB",
                    "bankName": "HSBC BANK"
                },
                {
                    "bankCode": "GSI",
                    "bankName": "GOLDMAN SACH (INDIA) CAPITAL MARKET"
                },
                {
                    "bankCode": "NFI",
                    "bankName": "NOMURA FIXED INCOME SECURITIES PVT"
                },
                {
                    "bankCode": "ALL",
                    "bankName": "ALLAHABAD BANK"
                },
                {
                    "bankCode": "SBT",
                    "bankName": "STATE BANK OF TRAVANCORE"
                },
                {
                    "bankCode": "SBI",
                    "bankName": "STATE BANK OF INDIA"
                },
                {
                    "bankCode": "NOS",
                    "bankName": "THE BANK OF NOVA SCOTIA"
                },
                {
                    "bankCode": "MSC",
                    "bankName": "MAHARASHTRA STATE COOP BANK LTD"
                },
                {
                    "bankCode": "SBH",
                    "bankName": "STATE BANK OF HYDERABAD"
                },
                {
                    "bankCode": "BAC",
                    "bankName": "BASSEIN CATHOLIC COOP BANK LTD"
                },
                {
                    "bankCode": "SPC",
                    "bankName": "THE SURAT PEOPLES COOP BANK LTD"
                },
                {
                    "bankCode": "TBS",
                    "bankName": "THANE BHARAT SAHAKARI BANK LTD"
                },
                {
                    "bankCode": "NGS",
                    "bankName": "NAGPUR NAGARIK SAHAKARI BANK LTD"
                },
                {
                    "bankCode": "SDC",
                    "bankName": "THE SURAT DIST COOP BANK LTD"
                },
                {
                    "bankCode": "MUB",
                    "bankName": "THE MUNICIPAL COOP BANK LTD"
                },
                {
                    "bankCode": "CIU",
                    "bankName": "CITY UNION BANK LTD"
                },
                {
                    "bankCode": "KAR",
                    "bankName": "KARNATAKA BANK LTD"
                },
                {
                    "bankCode": "COR",
                    "bankName": "CORPORATION BANK"
                },
                {
                    "bankCode": "IDI",
                    "bankName": "INDIAN BANK"
                },
                {
                    "bankCode": "BOF",
                    "bankName": "BANK OF AMERICA"
                },
                {
                    "bankCode": "UTI",
                    "bankName": "AXIS BANK"
                },
                {
                    "bankCode": "SCB",
                    "bankName": "STANDARD CHARTERED BANK"
                },
                {
                    "bankCode": "ORC",
                    "bankName": "ORISSA STATE CO OP BANK LTD"
                },
                {
                    "bankCode": "CNR",
                    "bankName": "CANARA BANK"
                },
                {
                    "bankCode": "ORB",
                    "bankName": "ORIENTAL BANK OF COMMERCE"
                },
                {
                    "bankCode": "MAH",
                    "bankName": "BANK OF MAHARASHTRA"
                },
                {
                    "bankCode": "IOB",
                    "bankName": "INDIAN OVERSEAS BANK"
                },
                {
                    "bankCode": "SBM",
                    "bankName": "STATE BANK OF MYSORE"
                },
                {
                    "bankCode": "SBB",
                    "bankName": "STATE BANK OF BIKANER AND JAIPUR"
                },
                {
                    "bankCode": "CSB",
                    "bankName": "CATHOLIC SYRIAN BANK LTD"
                },
                {
                    "bankCode": "MSH",
                    "bankName": "MASHREQBANK PSC"
                },
                {
                    "bankCode": "KCB",
                    "bankName": "THE KAPOL COOP BANK LTD"
                },
                {
                    "bankCode": "UTB",
                    "bankName": "UNITED BANK OF INDIA"
                },
                {
                    "bankCode": "ASB",
                    "bankName": "APNA SAHAKARI BANK LTD"
                },
                {
                    "bankCode": "PJS",
                    "bankName": "PARSIK JANATA SAHAKARI BANK LTD"
                },
                {
                    "bankCode": "WPA",
                    "bankName": "WESTPAC BANKING CORPORATION"
                },
                {
                    "bankCode": "ABH",
                    "bankName": "ABHYUDAYA CO OP BANK LTD"
                },
                {
                    "bankCode": "SJS",
                    "bankName": "SOLAPUR JANATA SAHAKARI BANK LTD"
                },
                {
                    "bankCode": "AKJ",
                    "bankName": "AKOLA JANATA COMMERCIAL COOP BANK"
                },
                {
                    "bankCode": "XNS",
                    "bankName": "NATIONAL STOCK EXCHANGE OF INDIA LT"
                },
                {
                    "bankCode": "JAS",
                    "bankName": "JANASEVA SAHAKARI BANK (BORIVLI) LT"
                },
                {
                    "bankCode": "MSP",
                    "bankName": "MORGAN STANLEY INDIA PRIMARY DEALER"
                },
                {
                    "bankCode": "BKI",
                    "bankName": "BANK OF INDIA"
                },
                {
                    "bankCode": "KKB",
                    "bankName": "KOTAK MAHINDRA BANK"
                },
                {
                    "bankCode": "DLX",
                    "bankName": "THE DHANALAKSHMI BANK LTD"
                }
            ],
            "industries": [
                {
                    "industryCode": "0047",
                    "industryDescription": "Iron & Steel"
                },
                {
                    "industryCode": "0048",
                    "industryDescription": "SEP (Doc, CA, Architect/Lawyer"
                },
                {
                    "industryCode": "0049",
                    "industryDescription": "SEP (Entertainment/Alternate M"
                },
                {
                    "industryCode": "0050",
                    "industryDescription": "Agricultural Commodities"
                },
                {
                    "industryCode": "0051",
                    "industryDescription": "Petrol Pump"
                },
                {
                    "industryCode": "0052",
                    "industryDescription": "FMCG"
                },
                {
                    "industryCode": "0053",
                    "industryDescription": "Business correspondent"
                },
                {
                    "industryCode": "0054",
                    "industryDescription": "Cables"
                },
                {
                    "industryCode": "0055",
                    "industryDescription": "Engineering"
                },
                {
                    "industryCode": "0056",
                    "industryDescription": "Healthcare"
                },
                {
                    "industryCode": "0057",
                    "industryDescription": "Leather"
                },
                {
                    "industryCode": "0058",
                    "industryDescription": "Metals"
                },
                {
                    "industryCode": "0059",
                    "industryDescription": "Power"
                },
                {
                    "industryCode": "0060",
                    "industryDescription": "Retail"
                },
                {
                    "industryCode": "0061",
                    "industryDescription": "Shipping"
                },
                {
                    "industryCode": "0062",
                    "industryDescription": "Tobacco"
                },
                {
                    "industryCode": "0063",
                    "industryDescription": "others"
                },
                {
                    "industryCode": "0064",
                    "industryDescription": "School"
                },
                {
                    "industryCode": "0065",
                    "industryDescription": "College"
                },
                {
                    "industryCode": "0066",
                    "industryDescription": "University"
                },
                {
                    "industryCode": "0067",
                    "industryDescription": "National Institutes"
                },
                {
                    "industryCode": "0068",
                    "industryDescription": "Hospital"
                },
                {
                    "industryCode": "0069",
                    "industryDescription": "Research Centre"
                },
                {
                    "industryCode": "0070",
                    "industryDescription": "CSR Foundations"
                },
                {
                    "industryCode": "0071",
                    "industryDescription": "Temple"
                },
                {
                    "industryCode": "0072",
                    "industryDescription": "Church"
                },
                {
                    "industryCode": "0073",
                    "industryDescription": "Mosque / Dargah"
                },
                {
                    "industryCode": "0074",
                    "industryDescription": "Gurudwara"
                },
                {
                    "industryCode": "0075",
                    "industryDescription": "Endowment Board"
                },
                {
                    "industryCode": "0076",
                    "industryDescription": "Wakf Board"
                },
                {
                    "industryCode": "0077",
                    "industryDescription": "Diocese"
                },
                {
                    "industryCode": "0078",
                    "industryDescription": "SGPC"
                },
                {
                    "industryCode": "0079",
                    "industryDescription": "Sports Club"
                },
                {
                    "industryCode": "0080",
                    "industryDescription": "Private Club"
                },
                {
                    "industryCode": "0081",
                    "industryDescription": "Gymkhana"
                },
                {
                    "industryCode": "0082",
                    "industryDescription": "Family Trust"
                },
                {
                    "industryCode": "0083",
                    "industryDescription": "PF"
                },
                {
                    "industryCode": "0084",
                    "industryDescription": "Gratuity / Superannuation"
                },
                {
                    "industryCode": "0085",
                    "industryDescription": "Pension Fund Trust"
                },
                {
                    "industryCode": "0086",
                    "industryDescription": "ESOP Trust"
                },
                {
                    "industryCode": "0087",
                    "industryDescription": "Gram Panchayat"
                },
                {
                    "industryCode": "0088",
                    "industryDescription": "Municipal Corporation / Munici"
                },
                {
                    "industryCode": "0089",
                    "industryDescription": "Office of BDO / DDO"
                },
                {
                    "industryCode": "0090",
                    "industryDescription": "Municipality / Municipal Counc"
                },
                {
                    "industryCode": "0091",
                    "industryDescription": "Education"
                },
                {
                    "industryCode": "0092",
                    "industryDescription": "Contractor"
                },
                {
                    "industryCode": "0093",
                    "industryDescription": "Consultant"
                },
                {
                    "industryCode": "0001",
                    "industryDescription": "Advertising/Media / Entertainm"
                },
                {
                    "industryCode": "0002",
                    "industryDescription": "Agriculture"
                },
                {
                    "industryCode": "0003",
                    "industryDescription": "Airlines"
                },
                {
                    "industryCode": "0004",
                    "industryDescription": "Arms/Antique/Art Dealer"
                },
                {
                    "industryCode": "0005",
                    "industryDescription": "Auto Finance Co"
                },
                {
                    "industryCode": "0006",
                    "industryDescription": "Automobile"
                },
                {
                    "industryCode": "0007",
                    "industryDescription": "Bar/Casino/Night club"
                },
                {
                    "industryCode": "0008",
                    "industryDescription": "bullion"
                },
                {
                    "industryCode": "0009",
                    "industryDescription": "Cement"
                },
                {
                    "industryCode": "0010",
                    "industryDescription": "Government Contractors/Contrac"
                },
                {
                    "industryCode": "0011",
                    "industryDescription": "Chemicals/Dyes/Paints"
                },
                {
                    "industryCode": "0012",
                    "industryDescription": "Consultancy"
                },
                {
                    "industryCode": "0013",
                    "industryDescription": "Consumer Durables"
                },
                {
                    "industryCode": "0014",
                    "industryDescription": "Courier/ Freight Forwarders"
                },
                {
                    "industryCode": "0015",
                    "industryDescription": "Dairy/Food Processing"
                },
                {
                    "industryCode": "0016",
                    "industryDescription": "Store - Retail outlet (Bakery/"
                },
                {
                    "industryCode": "0017",
                    "industryDescription": "Education Institutes/school/co"
                },
                {
                    "industryCode": "0018",
                    "industryDescription": "Electronics/Comput"
                },
                {
                    "industryCode": "0019",
                    "industryDescription": "Engineering goods"
                },
                {
                    "industryCode": "0020",
                    "industryDescription": "Exchange house"
                },
                {
                    "industryCode": "0021",
                    "industryDescription": "Fertilizers/Seeds/Pesticides"
                },
                {
                    "industryCode": "0022",
                    "industryDescription": "Fishery/Poultry"
                },
                {
                    "industryCode": "0023",
                    "industryDescription": "Furniture/Timber"
                },
                {
                    "industryCode": "0024",
                    "industryDescription": "Gems & Jewellery"
                },
                {
                    "industryCode": "0025",
                    "industryDescription": "Health Club/Spa"
                },
                {
                    "industryCode": "0026",
                    "industryDescription": "Nursing home/clinic /Life scie"
                },
                {
                    "industryCode": "0027",
                    "industryDescription": "Hotel/Resort"
                },
                {
                    "industryCode": "0028",
                    "industryDescription": "Housing Finance Co"
                },
                {
                    "industryCode": "0029",
                    "industryDescription": "Insurance Co"
                },
                {
                    "industryCode": "0030",
                    "industryDescription": "IT/Software/BPO/IT"
                },
                {
                    "industryCode": "0031",
                    "industryDescription": "Liquor Distributor"
                },
                {
                    "industryCode": "0032",
                    "industryDescription": "Marble/Granite"
                },
                {
                    "industryCode": "0033",
                    "industryDescription": "Other pvt financial corp"
                },
                {
                    "industryCode": "0034",
                    "industryDescription": "Petroleum Oil & Gas"
                },
                {
                    "industryCode": "0035",
                    "industryDescription": "Pharmaceuticals / Chemists"
                },
                {
                    "industryCode": "0036",
                    "industryDescription": "Plastic/Paper & Allied product"
                },
                {
                    "industryCode": "0037",
                    "industryDescription": "Printing/Publishing"
                },
                {
                    "industryCode": "0038",
                    "industryDescription": "Construction/Real estate/ Buil"
                },
                {
                    "industryCode": "0039",
                    "industryDescription": "Realty & Infrastructure"
                },
                {
                    "industryCode": "0040",
                    "industryDescription": "Scrap Metal"
                },
                {
                    "industryCode": "0041",
                    "industryDescription": "Telecom"
                },
                {
                    "industryCode": "0042",
                    "industryDescription": "Term Lending Co"
                },
                {
                    "industryCode": "0043",
                    "industryDescription": "Textiles/Garments/ Handl"
                },
                {
                    "industryCode": "0044",
                    "industryDescription": "Transportation /Logistics"
                },
                {
                    "industryCode": "0045",
                    "industryDescription": "Tour Travel & Tourism"
                },
                {
                    "industryCode": "0046",
                    "industryDescription": "Mining"
                },
                {
                    "industryCode": "01",
                    "industryDescription": "AIRLINES"
                },
                {
                    "industryCode": "0094",
                    "industryDescription": "Charitable - Social- Welfare"
                },
                {
                    "industryCode": "0166",
                    "industryDescription": "Banking (Financial Services)"
                },
                {
                    "industryCode": "0167",
                    "industryDescription": "Irrigation"
                },
                {
                    "industryCode": "0168",
                    "industryDescription": "Money services business"
                },
                {
                    "industryCode": "0174",
                    "industryDescription": "Government - Road transportati"
                },
                {
                    "industryCode": "0176",
                    "industryDescription": "Government - Rural development"
                },
                {
                    "industryCode": "0179",
                    "industryDescription": "Government - Food and public"
                },
                {
                    "industryCode": "0184",
                    "industryDescription": "Used car dealer"
                },
                {
                    "industryCode": "0186",
                    "industryDescription": "Internet Cafe"
                },
                {
                    "industryCode": "0189",
                    "industryDescription": "Movie theatre"
                },
                {
                    "industryCode": "0195",
                    "industryDescription": "Waste collection, treatment an"
                },
                {
                    "industryCode": "0196",
                    "industryDescription": "Civil engineering"
                },
                {
                    "industryCode": "0197",
                    "industryDescription": "Warehousing and support"
                },
                {
                    "industryCode": "0198",
                    "industryDescription": "Event Catering"
                },
                {
                    "industryCode": "0199",
                    "industryDescription": "Architecture and engineering"
                },
                {
                    "industryCode": "0200",
                    "industryDescription": "Veterinary activities"
                },
                {
                    "industryCode": "0206",
                    "industryDescription": "Securitisation trust"
                },
                {
                    "industryCode": "0169",
                    "industryDescription": "Stock Broker"
                },
                {
                    "industryCode": "0171",
                    "industryDescription": "Financial Advisory - Portfolio"
                },
                {
                    "industryCode": "0172",
                    "industryDescription": "Gambling"
                },
                {
                    "industryCode": "0175",
                    "industryDescription": "Government - Water resources"
                },
                {
                    "industryCode": "0177",
                    "industryDescription": "Government - Skill Development"
                },
                {
                    "industryCode": "0180",
                    "industryDescription": "Gvernment - Human Resource"
                },
                {
                    "industryCode": "0181",
                    "industryDescription": "Government -Housing Developmen"
                },
                {
                    "industryCode": "0182",
                    "industryDescription": "Government -Defence"
                },
                {
                    "industryCode": "0185",
                    "industryDescription": "Boat/Plane Dealership"
                },
                {
                    "industryCode": "0190",
                    "industryDescription": "Law firm"
                },
                {
                    "industryCode": "0191",
                    "industryDescription": "Venture Capital Companies"
                },
                {
                    "industryCode": "0201",
                    "industryDescription": "Rental and leasing activities"
                },
                {
                    "industryCode": "0203",
                    "industryDescription": "Security and investigation act"
                },
                {
                    "industryCode": "0205",
                    "industryDescription": "Activities of extraterritorial"
                },
                {
                    "industryCode": "0095",
                    "industryDescription": "Activities of Membership organ"
                },
                {
                    "industryCode": "0096",
                    "industryDescription": "Animal Husbandry Services"
                },
                {
                    "industryCode": "0097",
                    "industryDescription": "Basic metals"
                },
                {
                    "industryCode": "0098",
                    "industryDescription": "Coal and Lignite"
                },
                {
                    "industryCode": "0099",
                    "industryDescription": "Fabricated metal products (exc"
                },
                {
                    "industryCode": "0100",
                    "industryDescription": "Financial Intermediation- Bank"
                },
                {
                    "industryCode": "0101",
                    "industryDescription": "Aquaculture"
                },
                {
                    "industryCode": "0102",
                    "industryDescription": "Food and Cash Crops (excluding"
                },
                {
                    "industryCode": "0103",
                    "industryDescription": "Handicraft"
                },
                {
                    "industryCode": "0104",
                    "industryDescription": "Indirect Finance to Agricultur"
                },
                {
                    "industryCode": "0105",
                    "industryDescription": "Infrastructure- energy"
                },
                {
                    "industryCode": "0106",
                    "industryDescription": "Infrastructure- Social and com"
                },
                {
                    "industryCode": "0107",
                    "industryDescription": "Infrastructure- water sanitati"
                },
                {
                    "industryCode": "0108",
                    "industryDescription": "Land Transport; Transport via"
                },
                {
                    "industryCode": "0109",
                    "industryDescription": "Medical instruments, watches a"
                },
                {
                    "industryCode": "0110",
                    "industryDescription": "Metal Ores"
                },
                {
                    "industryCode": "0111",
                    "industryDescription": "Miscallenous"
                },
                {
                    "industryCode": "0112",
                    "industryDescription": "Motor Vehicles, Trailers and S"
                },
                {
                    "industryCode": "0113",
                    "industryDescription": "Office, accounting and computi"
                },
                {
                    "industryCode": "0114",
                    "industryDescription": "Other Direct Finance to Agricu"
                },
                {
                    "industryCode": "0115",
                    "industryDescription": "Other Mining and Quarrying"
                },
                {
                    "industryCode": "0116",
                    "industryDescription": "Other transport equipment"
                },
                {
                    "industryCode": "0117",
                    "industryDescription": "Personal loans and Consumer lo"
                },
                {
                    "industryCode": "0118",
                    "industryDescription": "Plantation Crops"
                },
                {
                    "industryCode": "0119",
                    "industryDescription": "Postal and cable services"
                },
                {
                    "industryCode": "0120",
                    "industryDescription": "Public Administration and Defe"
                },
                {
                    "industryCode": "0121",
                    "industryDescription": "Reproduction of recorded media"
                },
                {
                    "industryCode": "0122",
                    "industryDescription": "Radio, Television and Communic"
                },
                {
                    "industryCode": "0123",
                    "industryDescription": "Real Estate Activities"
                },
                {
                    "industryCode": "0124",
                    "industryDescription": "Recreational, Cultural and Spo"
                },
                {
                    "industryCode": "0125",
                    "industryDescription": "Recycling"
                },
                {
                    "industryCode": "0126",
                    "industryDescription": "Renting of Machinery and Equip"
                },
                {
                    "industryCode": "0127",
                    "industryDescription": "Research and Development"
                },
                {
                    "industryCode": "0128",
                    "industryDescription": "Rubber and plastic products"
                },
                {
                    "industryCode": "0129",
                    "industryDescription": "Supporting and auxiliary trans"
                },
                {
                    "industryCode": "0130",
                    "industryDescription": "Uranium and Thorium"
                },
                {
                    "industryCode": "0131",
                    "industryDescription": "Water Transport"
                },
                {
                    "industryCode": "0132",
                    "industryDescription": "Wood and wood products (except"
                },
                {
                    "industryCode": "0133",
                    "industryDescription": "Electrical machinery and appar"
                },
                {
                    "industryCode": "0134",
                    "industryDescription": "Farming of Animals, silkworm"
                },
                {
                    "industryCode": "0135",
                    "industryDescription": "Financial Intermediation- NBFC"
                },
                {
                    "industryCode": "0136",
                    "industryDescription": "Forestry, Logging & Related Se"
                },
                {
                    "industryCode": "0137",
                    "industryDescription": "Health and Social work"
                },
                {
                    "industryCode": "0138",
                    "industryDescription": "Infrastructure- Communication"
                },
                {
                    "industryCode": "0139",
                    "industryDescription": "Infrastructure- transport"
                },
                {
                    "industryCode": "0140",
                    "industryDescription": "Pension Funding"
                },
                {
                    "industryCode": "0142",
                    "industryDescription": "Machinery and equipments"
                },
                {
                    "industryCode": "0143",
                    "industryDescription": "Other Business activities"
                },
                {
                    "industryCode": "0144",
                    "industryDescription": "Other non metalic mineral prod"
                },
                {
                    "industryCode": "0145",
                    "industryDescription": "Activities auxiliary to Financ"
                },
                {
                    "industryCode": "0146",
                    "industryDescription": "Beverages-Liquor,wine,fanny an"
                },
                {
                    "industryCode": "0147",
                    "industryDescription": "Beverages-Soft drinks"
                },
                {
                    "industryCode": "0148",
                    "industryDescription": "Chemical and chemical products"
                },
                {
                    "industryCode": "0149",
                    "industryDescription": "Pharma &drugs,soaps"
                },
                {
                    "industryCode": "0150",
                    "industryDescription": "Coal products, refined petrole"
                },
                {
                    "industryCode": "0151",
                    "industryDescription": "Finacial Intermediation- Other"
                },
                {
                    "industryCode": "0152",
                    "industryDescription": "Finacial Intermediation- Other"
                },
                {
                    "industryCode": "0153",
                    "industryDescription": "Finacial Intermediation- Co-op"
                },
                {
                    "industryCode": "0154",
                    "industryDescription": "Restaurants,canteens"
                },
                {
                    "industryCode": "0155",
                    "industryDescription": "Agricultural Finance, Indirect"
                },
                {
                    "industryCode": "0156",
                    "industryDescription": "Other financial intermediation"
                },
                {
                    "industryCode": "0157",
                    "industryDescription": "Oth Serv actvty- Craftsm, Main"
                },
                {
                    "industryCode": "0158",
                    "industryDescription": "Other Service activity-laundry"
                },
                {
                    "industryCode": "0159",
                    "industryDescription": "Lending to Construt contractor"
                },
                {
                    "industryCode": "0160",
                    "industryDescription": "Other than Infra lending (Gene"
                },
                {
                    "industryCode": "0161",
                    "industryDescription": "Retail Trade (excpt Vehicle, D"
                },
                {
                    "industryCode": "0162",
                    "industryDescription": "Retail Trade (Sale of Diamonds"
                },
                {
                    "industryCode": "0163",
                    "industryDescription": "Wholesale and retail trade -Ve"
                },
                {
                    "industryCode": "0165",
                    "industryDescription": "Wholesale Trade and Commission"
                },
                {
                    "industryCode": "0141",
                    "industryDescription": "Leather"
                },
                {
                    "industryCode": "0170",
                    "industryDescription": "Merchant banking"
                },
                {
                    "industryCode": "0173",
                    "industryDescription": "Government - trust/society"
                },
                {
                    "industryCode": "0178",
                    "industryDescription": "Government - Social Justice"
                },
                {
                    "industryCode": "0183",
                    "industryDescription": "Investment Management/Money Ma"
                },
                {
                    "industryCode": "0187",
                    "industryDescription": "Pawn Shops"
                },
                {
                    "industryCode": "0188",
                    "industryDescription": "Dot-com Company or internet"
                },
                {
                    "industryCode": "0192",
                    "industryDescription": "sports goods , games and toys"
                },
                {
                    "industryCode": "0193",
                    "industryDescription": "Electric power generation ,"
                },
                {
                    "industryCode": "0194",
                    "industryDescription": "Gas - distribution of gaseous"
                },
                {
                    "industryCode": "0202",
                    "industryDescription": "Employment activities"
                },
                {
                    "industryCode": "0204",
                    "industryDescription": "Libraries, archives, museums"
                }
            ],
            "businesses": [
                {
                    "businessType": "Trading"
                },
                {
                    "businessType": "Manufacturing"
                },
                {
                    "businessType": "Services"
                }
            ],
            "loanPrograms": [
                {
                    "programId": "abc",
                    "loanLowerLimit": 0,
                    "loanUpperLimit": 1000000000,
                    "name": "GSTOD",
                    "sanctionTime": "60 mins",
                    "info": "In < 60 mins, get direct sanction of upto INR 1 cr based on submission of GST, ITR and Banking",
                    "requirementListHeader": "For Sanction in <60 mins, ensure that the customer keeps the following information ready",
                    "Documents": [
                        {
                            "document": "PAN and Address",
                            "documentDisplayName": "PAN Number and Address of the Applicant, all Guarantors and Group entities"
                        },
                        {
                            "document": "6 months Bank Statement",
                            "documentDisplayName": "Last 6M Bank Statements of all working capital limits and all major current accounts (in e-PDF format)"
                        },
                        {
                            "document": "GST details",
                            "documentDisplayName": "GST Username and Registered Mobile Number to receive an OTP  / GST registration Certificate along with last 12 months GSTR 3B acknowledgment"
                        },
                        {
                            "document": "1 year ITR Details",
                            "documentDisplayName": "Income Tax Returns Password / Income Tax Return of Borrower along with Computation of Income for last 1 Year for company and guarantors"
                        },
                        {
                            "document": "Proof of vintage",
                            "documentDisplayName": "Proof of vintage establishing date of incorporation (e.g. Shops and Establishments Act certificate)"
                        },
                        {
                            "document": "Proof of Address",
                            "documentDisplayName": "Proof of address establishing current business address"
                        }
                    ],
                    "DocumentCards": [
                        {
                            "displayName": "Case Details"
                        },
                        {
                            "displayName": "KYC & Bureau Check"
                        },
                        {
                            "displayName": "Bank Statements"
                        },
                        {
                            "displayName": "GSTN"
                        },
                        {
                            "displayName": "ITR"
                        },
                        {
                            "displayName": "Financials"
                        },
                        {
                            "displayName": "Vintage  Proof"
                        },
                        {
                            "displayName": "Additional Questions"
                        },
                        {
                            "displayName": "QCA"
                        }
                    ]
                },
                {
                    "programId": "efg",
                    "loanLowerLimit": 0,
                    "loanUpperLimit": 1500000000,
                    "name": "TURBOOD",
                    "sanctionTime": "12 hrs",
                    "info": "In < 12 hrs, get sanction of upto INR 1.5 cr based on submission of 1Y Financials, GST, ITR and Banking",
                    "requirementListHeader": "For Sanction in <12 Hours, ensure that the customer keeps the following information ready",
                    "Documents": [
                        {
                            "document": "PAN and Address",
                            "documentDisplayName": "PAN Number and Address of the Applicant, all Guarantors and Group entities"
                        },
                        {
                            "document": "12 months Bank Statement",
                            "documentDisplayName": "Last 12M Bank Statements of all working capital limits and all major current accounts (in e-PDF format)"
                        },
                        {
                            "document": "GST details",
                            "documentDisplayName": "GST Username and Registered Mobile Number to receive an OTP  / GST registration Certificate along with last 12 months GSTR 3B acknowledgment"
                        },
                        {
                            "document": "1 year ITR Details",
                            "documentDisplayName": "Income Tax Returns Password / Income Tax Return of Borrower along with Computation of Income for last 1 Year for company and guarantors"
                        },
                        {
                            "document": "Proof of vintage",
                            "documentDisplayName": "Proof of vintage establishing date of incorporation (e.g. Shops and Establishments Act certificate)"
                        },
                        {
                            "document": "Proof of Address",
                            "documentDisplayName": "Proof of address establishing current business address"
                        },
                        {
                            "document": "1 year Audited Financials",
                            "documentDisplayName": "Last Audited Financials including P&L, Balance Sheet and all schedules"
                        },
                        {
                            "document": "Declaration of Debtors",
                            "documentDisplayName": "Declaration of key debtors along with their ageing cycles"
                        }
                    ],
                    "DocumentCards": [
                        {
                            "displayName": "Case Details"
                        },
                        {
                            "displayName": "KYC & Bureau Check"
                        },
                        {
                            "displayName": "Bank Statements"
                        }
                    ]
                },
                {
                    "programId": "pqr",
                    "loanLowerLimit": 0,
                    "loanUpperLimit": 2500000000,
                    "name": "RAPIDOD",
                    "sanctionTime": "12 hrs",
                    "info": "In < 12 hrs, get sanction of upto INR 2.5 cr based on submission of 2Y Financials, GST, ITR and Banking",
                    "requirementListHeader": "For Sanction in <24 Hours, ensure that the customer keeps the following information ready",
                    "Documents": [
                        {
                            "document": "PAN and Address",
                            "documentDisplayName": "PAN Number and Address of the Applicant, all Guarantors and Group entities"
                        },
                        {
                            "document": "12 months Bank Statement",
                            "documentDisplayName": "Last 12M Bank Statements of all working capital limits and all major current accounts (in e-PDF format)"
                        },
                        {
                            "document": "GST details",
                            "documentDisplayName": "GST Username and Registered Mobile Number to receive an OTP  / GST registration Certificate along with last 12 months GSTR 3B acknowledgment"
                        },
                        {
                            "document": "Proof of vintage",
                            "documentDisplayName": "Proof of vintage establishing date of incorporation (e.g. Shops and Establishments Act certificate)"
                        },
                        {
                            "document": "Proof of Address",
                            "documentDisplayName": "Proof of address establishing current business address"
                        },
                        {
                            "document": "Declaration of Debtors",
                            "documentDisplayName": "Declaration of key debtors along with their ageing cycles"
                        },
                        {
                            "document": "2 years Audited Financials",
                            "documentDisplayName": "Last 2 Year Audited Financials including P&L, Balance Sheet and all schedules"
                        },
                        {
                            "document": "Latest projections",
                            "documentDisplayName": "Latest projections of financials including understanding of key assumptions"
                        },
                        {
                            "document": "2 years ITR Details",
                            "documentDisplayName": "Income Tax Returns Password / Income Tax Return of Borrower along with Computation of Income for last 2 Year for applicant and guarantors"
                        }
                    ],
                    "DocumentCards": []
                },
                {
                    "programId": "xyz",
                    "loanLowerLimit": 2500000000,
                    "loanUpperLimit": 5000000000,
                    "name": "ENTERPRISE",
                    "sanctionTime": "seamless",
                    "info": "For limit requirement in the range of INR 2.5 cr - INR 5 cr",
                    "requirementListHeader": "For seamless loan processing, ensure that the customer keeps the following information ready",
                    "Documents": [
                        {
                            "document": "PAN and Address",
                            "documentDisplayName": "PAN Number and Address of the Applicant, all Guarantors and Group entities"
                        },
                        {
                            "document": "12 months Bank Statement",
                            "documentDisplayName": "Last 12M Bank Statements of all working capital limits and all major current accounts (in e-PDF format)"
                        },
                        {
                            "document": "GST details",
                            "documentDisplayName": "GST Username and Registered Mobile Number to receive an OTP  / GST registration Certificate along with last 12 months GSTR 3B acknowledgment"
                        },
                        {
                            "document": "Proof of vintage",
                            "documentDisplayName": "Proof of vintage establishing date of incorporation (e.g. Shops and Establishments Act certificate)"
                        },
                        {
                            "document": "Proof of Address",
                            "documentDisplayName": "Proof of address establishing current business address"
                        },
                        {
                            "document": "Latest projections",
                            "documentDisplayName": "Latest projections of financials including understanding of key assumptions"
                        },
                        {
                            "document": "3 years ITR Details",
                            "documentDisplayName": "Income Tax Returns Password / Income Tax Return of Borrower along with Computation of Income for last 3 Year for applicant and guarantors"
                        },
                        {
                            "document": "6 months Stock Statements",
                            "documentDisplayName": "Stock statement for the last 6 month"
                        },
                        {
                            "document": "List of Debtors",
                            "documentDisplayName": "List of Debtors and their value (Latest available and last Financial Year)"
                        }
                    ],
                    "DocumentCards": []
                }
            ],
            "collateral": [
                {
                    "typeDescription": "IMMOVABLE PROPERTIES",
                    "displayName": "Immovable Properties",
                    "CollateralSubTypes": [
                        {
                            "typeDescription": "AGRICULTURAL LAND",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "COMMERCIAL CUM RESIDNTIAL PLOT",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "COMMERCIAL PLOT",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "Commercial Plot",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "COMML/RESIDENTIAL BUILDING",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "FACTORY LAND",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "FACTORY LAND AND BUILDING",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "RESIDENTIAL BUILDING",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "RESIDENTIAL PLOT",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "COMMERCIAL BUILDING",
                            "displayName": null,
                            "isLetOut": false
                        }
                    ]
                },
                {
                    "typeDescription": "LEASE HOLD RIGHTS / RETIREMENT BENEFITS",
                    "displayName": "Lease hold rights or Retirement benifits",
                    "CollateralSubTypes": [
                        {
                            "typeDescription": "LIEN ON PF",
                            "displayName": null,
                            "isLetOut": false
                        }
                    ]
                },
                {
                    "typeDescription": "STOCK and BOOK DEBTS",
                    "displayName": "Stock & Book debts",
                    "CollateralSubTypes": [
                        {
                            "typeDescription": "HYPOTHECATED STOCK",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "BOOK DEBTS",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "PLEDGED STOCK",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "BOOK DEBTS",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "AGRICULTURAL IMPLEMENT",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "LIVE STOCK",
                            "displayName": null,
                            "isLetOut": false
                        }
                    ]
                },
                {
                    "typeDescription": "BILLS",
                    "displayName": "Bills",
                    "CollateralSubTypes": [
                        {
                            "typeDescription": "CLEAN BILLS",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "DA BILLS",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "DP BILLS",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "SUPPLY BILLS",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "SECURED BILLS - MLR,MR,BL",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "OTHER BILLS - CHEQUES",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "OTHER BILLS - ACCEPTED HUNDIES",
                            "displayName": null,
                            "isLetOut": false
                        }
                    ]
                },
                {
                    "typeDescription": "GOLD",
                    "displayName": "Gold",
                    "CollateralSubTypes": [
                        {
                            "typeDescription": "GOLD ORNAMENTS",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "GOLD BULLION",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "GOLD BOND",
                            "displayName": null,
                            "isLetOut": false
                        }
                    ]
                },
                {
                    "typeDescription": "VEHICLES",
                    "displayName": "Vehicles",
                    "CollateralSubTypes": [
                        {
                            "typeDescription": "PLANT AND MACHINERY",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "MACHINERY",
                            "displayName": null,
                            "isLetOut": false
                        }
                    ]
                },
                {
                    "typeDescription": "CONSUMER DURABLES",
                    "displayName": "Consumer Durables",
                    "CollateralSubTypes": [
                        {
                            "typeDescription": "BUS",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "MINI BUS",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "LIGHT COMMERCIAL VEHICLES",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "HEAVY COMMERCIAL VEHICLES",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "EARTH COMMERCIAL VEHICLES",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "OTHER HEAVY VEHICLES",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "CAR",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "TAXI",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "AUTO RIKSHAW",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "MOTORBIKE",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "SCOOTER",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "MOPED",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "SMALL COMMERCIAL VEHICLE",
                            "displayName": null,
                            "isLetOut": false
                        }
                    ]
                },
                {
                    "typeDescription": "LIVESTOCK",
                    "displayName": "Livestock",
                    "CollateralSubTypes": [
                        {
                            "typeDescription": "COMPUTER",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "FURNITURE",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "REFRIGERATOR",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "TELEVISION",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "WASHING MACHINE",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "AUDIO/VIDEO SYSTEM",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "OTHER",
                            "displayName": null,
                            "isLetOut": false
                        }
                    ]
                },
                {
                    "typeDescription": "INSURANCE POLICIES",
                    "displayName": "Insurance Policies",
                    "CollateralSubTypes": [
                        {
                            "typeDescription": "BEE KEEPING",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "Duck Rearing",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "Fishery",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "Goat",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "Milch Animals",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "Pig",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "Plough Animals",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "Poultry",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "Rabbit Rearing",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "Sericulture",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "Sheep/Goat/Pig",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "Others",
                            "displayName": null,
                            "isLetOut": false
                        }
                    ]
                },
                {
                    "typeDescription": "SHARES AND INVESTMENTS",
                    "displayName": "Shares & investments",
                    "CollateralSubTypes": [
                        {
                            "typeDescription": "IDFC Bank deposits (Same Customer)",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "IDFC Bank deposits (Different Customer/Third-party)",
                            "displayName": null,
                            "isLetOut": false
                        }
                    ]
                },
                {
                    "typeDescription": "PAPER / INSURANCE BASED SECURITIES",
                    "displayName": "Paper or Insurance based securities",
                    "CollateralSubTypes": [
                        {
                            "typeDescription": "GENERAL INSURANCE POLICY",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "LIFE INSURANCE POLICY",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "POSTAL LIFE INSURANCE",
                            "displayName": null,
                            "isLetOut": false
                        }
                    ]
                },
                {
                    "typeDescription": "GUARANTEES",
                    "displayName": "Guarantees",
                    "CollateralSubTypes": [
                        {
                            "typeDescription": "MUTUAL FUND INVESTMENTS",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "OTHER INVESTMENTS",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "SHARES",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "BONDS AND DEBENTURES",
                            "displayName": null,
                            "isLetOut": false
                        }
                    ]
                },
                {
                    "typeDescription": "INTANGIBLE SECURITIES",
                    "displayName": "Intangible securities",
                    "CollateralSubTypes": [
                        {
                            "typeDescription": "NSC - VIII ISSUE",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "India Millenium Bond",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "INDIRA VIKAS PATRA",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "KISAN VIKAS PATRA",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "Paper/Insuranc",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "RBI Relief Bonds",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "Resurgent India Bond",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "OTHER GOVT SECURITIES",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "Paper based securities-PF bals",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "MAGNUM MF",
                            "displayName": null,
                            "isLetOut": false
                        }
                    ]
                },
                {
                    "typeDescription": "GOODWILL / PATENT",
                    "displayName": "Good will or Patent",
                    "CollateralSubTypes": [
                        {
                            "typeDescription": "CREDIT GUARANTEE CORPORATION",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "CENTRAL GOVERNMENT GUARANTEE",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "STATE GOVERNMENT GUARANTEE",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "GROUP GUARANTEE",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "PERSONAL GUARANTEE",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "CORPORATE GUARANTEE",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "BANK GUARANTEE",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "COVER AVAILABLE FROM ECGC",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "COVER AVAILABLE FROM CGTFI",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "LETTER OF COMFORT",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "SBLC",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "NON RESIDENT-CORPORATE GUARANTEE",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "NON RESIDENT- PERSONAL GUARANTEE",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "NON RESIDENT- BANK GUARANTEE",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "NON RESIDENT-LETTER OF COMFORT",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "NON RESIDENT-SBLC",
                            "displayName": null,
                            "isLetOut": false
                        }
                    ]
                },
                {
                    "typeDescription": "CURRENT ASSETS",
                    "displayName": "Current assets",
                    "CollateralSubTypes": [
                        {
                            "typeDescription": "BRAND EQUITY",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "PATENT",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "LICENSE",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "COPYRIGHTS",
                            "displayName": null,
                            "isLetOut": false
                        },
                        {
                            "typeDescription": "OTHER INTANGIBLE SECURITIES",
                            "displayName": null,
                            "isLetOut": false
                        }
                    ]
                }
            ]
        }
    }
}