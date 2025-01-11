document.addEventListener("DOMContentLoaded", () => {
    const percentages = {
        groceries: 0.05, // 5% savings
        "energy-bills": 0.01, // 10% savings
        travel: 0.05, // 12% savings
        "eating-out": 0.1, // 15% savings
        entertainment: 0.2, // 20% savings
        "coffee-shops": 0.1, // 10% savings
        fashion: 0.1, // 25% savings
        "home-diy": 0.1, // 8% savings
        "health-beauty": 0.1, // 10% savings
        electronics: 0.07, // 7% savings
    };

    const monthlyRentInput = document.getElementById("monthly-rent");
    const plannedSavingsInput = document.getElementById("planned-savings");
    const needsRows = document.querySelectorAll("#needs-body tr");
    const wantsRows = document.querySelectorAll("#wants-body tr");
    const needsSavingsElement = document.getElementById("needs-savings");
    const wantsSavingsElement = document.getElementById("wants-savings");
    const totalSavingsElement = document.getElementById("total-savings");

    let savings = 0;
    let needsSavings = 0;
    let wantsSavings = 0;

    const pieCtx = document.getElementById("spendingChart").getContext("2d");
    const spendingChart = new Chart(pieCtx, {
        type: "pie",
        data: {
            labels: [],
            datasets: [
                {
                    data: [],
                    backgroundColor: [
                        "#4CAF50", "#2196F3", "#FFC107", "#FF5722", "#9C27B0",
                        "#00BCD4", "#8BC34A", "#FF9800", "#3F51B5", "#607D8B",
                    ],
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "right",
                },
            },
        },
    });

    const barCtx = document.getElementById("spendingBarChart").getContext("2d");
    const barChart = new Chart(barCtx, {
        type: "bar",
        data: {
            labels: ["Total Spend", "Total spend with Boma"],
            datasets: [
                {
                    label: "Amount (£)",
                    data: [0, 0], // Placeholder values
                    backgroundColor: ["#FF5722", "#4CAF50"],
                },
                {
                    label: "Amount (£)",
                    data: [0, 0], // Placeholder values
                    backgroundColor: ["#4CAF50"],
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });

    function calculateSavings() {
        const monthlyRent = parseFloat(monthlyRentInput.value) || 0;
        const plannedSavings = parseFloat(plannedSavingsInput.value) || 0;

        needsSavings = calculateCategorySavings(needsRows);
        wantsSavings = calculateCategorySavings(wantsRows);
        savings = needsSavings + wantsSavings + plannedSavings;

        needsSavingsElement.textContent = `£${needsSavings.toFixed(2)}`;
        wantsSavingsElement.textContent = `£${wantsSavings.toFixed(2)}`;
        totalSavingsElement.textContent = `£${savings.toFixed(2)}`;

        const categories = [];
        const values = [];

        // Add rent and planned savings to the pie chart
        if (monthlyRent > 0) {
            categories.push("Rent");
            values.push(monthlyRent);
        }
        if (plannedSavings > 0) {
            categories.push("Planned Savings");
            values.push(plannedSavings);
        }

        addCategoryData(needsRows, categories, values);
        addCategoryData(wantsRows, categories, values);

        updateChart(categories, values);
        updateBarChart();
    }

    function calculateCategorySavings(rows) {
        let categorySavings = 0;

        rows.forEach((row) => {
            const input = row.querySelector("input[type='number']");
            const savingsElement = row.querySelector("span");
            const category = input.dataset.category;

            const spend = parseFloat(input.value) || 0;
            const savingsForRow = spend * 12 * (percentages[category] || 0);

            savingsElement.textContent = `£${savingsForRow.toFixed(2)}`;
            categorySavings += savingsForRow;
        });

        return categorySavings;
    }

    function addCategoryData(rows, categories, values) {
        rows.forEach((row) => {
            const input = row.querySelector("input[type='number']");
            const category = input.dataset.category;

            const spend = parseFloat(input.value) || 0;
            if (spend > 0) {
                categories.push(
                    category
                        .replace(/-/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())
                ); // Format category names
                values.push(spend);
            }
        });
    }

    function updateChart(categories, values) {
        spendingChart.data.labels = categories;
        spendingChart.data.datasets[0].data = values;
        spendingChart.update();
    }

    function updateBarChart() {
        const totalSpend = Array.from(needsRows)
            .concat(Array.from(wantsRows))
            .reduce((sum, row) => {
                const input = row.querySelector("input[type='number']");
                const spend = parseFloat(input.value) || 0;
                return sum + spend;
            }, parseFloat(monthlyRentInput.value) || 0);

        const totalDiscounts = Array.from(needsRows)
            .concat(Array.from(wantsRows))
            .reduce((sum, row) => {
                const input = row.querySelector("input[type='number']");
                const category = input.dataset.category;
                const spend = parseFloat(input.value) || 0;
                return sum + spend * (percentages[category] || 0);
            }, 0);

        const spendAfterSavings = totalSpend - totalDiscounts;

        barChart.data.datasets[0].data = [totalSpend, spendAfterSavings];
        barChart.data.datasets[0].label = "(£) " + totalSpend;
        barChart.data.datasets[1].label = "(£) " + spendAfterSavings;
        barChart.update();
    }

    [...needsRows, ...wantsRows].forEach((row) => {
        const input = row.querySelector("input[type='number']");
        input.addEventListener("input", calculateSavings);
    });

    monthlyRentInput.addEventListener("input", calculateSavings);
    plannedSavingsInput.addEventListener("input", calculateSavings);

    calculateSavings(); // Initial calculation
});
