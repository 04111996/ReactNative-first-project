const qcaQuestions = [
    {
        "questionId": 1,
        "question": "Any Banking relationship with IDFC FIRST BANK : (eg: ACS / Loans etc of Director/ Promoter / Trustee / Group Accounts etc)"
    },
    {
        "questionId": 2,
        "question": "How will the borrower finance expansion/investment plan (not taking the current loan application into account?"
    },
    {
        "questionId": 3,
        "question": "Business Operations - Does the company buy insurance for their products/ stocks / machinery?"
    },
    {
        "questionId": 4,
        "question": "Credit Relationship & Collateral - What is the length of the previous facility availed by customer ?"
    },
    {
        "questionId": 5,
        "question": "Credit Relationship & Collateral - Is there a change in collateral from existing banker during bank transfer ?"
    },
    {
        "questionId": 6,
        "question": "Financials - Is there any infusion/ withdrawal of funds post the preparation of audited financial statements?"
    },
    {
        "questionId": 7,
        "question": "Financials - Have all statutory dues been paid on time (check for last 3 years)"
    },
]

const qcaAnswers = [
    {
        "questionId": 1, 
        "answerId": 11, 
        "answer": "Less than 2 years",
    },
    {
        "questionId": 1, 
        "answerId": 12, 
        "answer": "2-5 years",
    },
    {
        "questionId": 1, 
        "answerId": 13, 
        "answer": "5-10 years",
    },
    {
        "questionId": 1, 
        "answerId": 14, 
        "answer": "10 - 15 years",
    },
    {
        "questionId": 1, 
        "answerId": 15, 
        "answer": "15 - 25 years",
    },
    {
        "questionId": 1, 
        "answerId": 16, 
        "answer": "More than - 25 years",
    },

    {
        "questionId": 2, 
        "answerId": 21, 
        "answer": "The borrower invests his retained earnings but no equity from friends and family are taken irrespective of outside debt",
    },
    {
        "questionId": 2, 
        "answerId": 22, 
        "answer": "The investment is a combination of retained earnings and equity from the borrower or borrower's family irrespective of outside debt",
    },

    {
        "questionId": 2, 
        "answerId": 23, 
        "answer": "The investment is from equity from outside borrower's family irrespective of outside debt",
    },
    {
        "questionId": 2, 
        "answerId": 24, 
        "answer": "The investment is only debt from outside",
    },
    {
        "questionId": 2, 
        "answerId": 25, 
        "answer": "Not applicable",
    },

    {
        "questionId": 3, 
        "answerId": 31, 
        "answer": "The company insures their product / stocks / machinery, and insurance covers most possible scenarios including machine failure / fire / theft etc.",
    },
    {
        "questionId": 3, 
        "answerId": 32, 
        "answer": "The company insures their product / stocks / machinery, and insurance V covers some scenarios, but fire / theft etc. are not covered",
    },
    {
        "questionId": 3, 
        "answerId": 33, 
        "answer": "The company does not avail insurance for their products / stocks / machinery",
    },

    {
        "questionId": 4, 
        "answerId": 41, 
        "answer": "Less than or equal to 3 months",
    },
    {
        "questionId": 4, 
        "answerId": 42, 
        "answer": "3 - 12 months",
    },
    {
        "questionId": 4, 
        "answerId": 43, 
        "answer": "12 – 30 months",
    },
    {
        "questionId": 4, 
        "answerId": 44, 
        "answer": "30 – 47 months",
    },
    {
        "questionId": 4, 
        "answerId": 45, 
        "answer": "More than 47 months",
    },

    // 5
    {
        "questionId": 5, 
        "answerId": 51, 
        "answer": "It is the same collateral with the same state of occupancy",
    },
    {
        "questionId": 5, 
        "answerId": 52, 
        "answer": "It is the same collateral with the different state of occupancy (e.g. earlier it was vacant but during this application became rented)",
    },
    {
        "questionId": 5, 
        "answerId": 53, 
        "answer": "It is not the same collateral",
    },
    {
        "questionId": 5, 
        "answerId": 54, 
        "answer": "Not applicabe as this is applicant's first secured loan",
    },

    // 6
    {
        "questionId": 6, 
        "answerId": 61, 
        "answer": "No there has not been any infusion /withdrawal of funds post the preparation of audited financial statements theft",
    },
    {
        "questionId": 6, 
        "answerId": 62, 
        "answer": "Yes, there has been infusion of funds post the preparation of audited financial statements",
    },
    {
        "questionId": 6, 
        "answerId": 63, 
        "answer": "Yes, there has been withdrawal of funds post the preparation of audited financial statements",
    },
    {
        "questionId": 6, 
        "answerId": 64, 
        "answer": "Yes, there has been infusion and withdrawal of funds post the preparation of audited financial statements",
    },

    // 7
    {
        "questionId": 7, 
        "answerId": 71, 
        "answer": "All dues are paid on time",
    },
    {
        "questionId": 7, 
        "answerId": 72, 
        "answer": "One payment is delayed",
    },
    {
        "questionId": 7, 
        "answerId": 73, 
        "answer": "More than one payment is delayed",
    },
    {
        "questionId": 7, 
        "answerId": 74, 
        "answer": "At least one or more statutory dues are currently in arrears",
    },
    

]

export { qcaQuestions, qcaAnswers }