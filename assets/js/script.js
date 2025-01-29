document.addEventListener("DOMContentLoaded", () => {
    const percentages = {
        rent: 0.0, // No savings percentage for rent
        savings: 0.0, // No percentage for savings
        groceries: 0.05,
        "energy-bills": 0.01,
        travel: 0.05,
        "eating-out": 0.1,
        entertainment: 0.2,
        "coffee-shops": 0.1,
        fashion: 0.1,
        "home-diy": 0.1,
        "health-beauty": 0.1,
        electronics: 0.07,
    };

    const inputs = document.querySelectorAll(".spend-row .styled-input");
    const spendSavingElements = document.querySelectorAll(".spend-row .spend-saving");
    const pieCtx = document.getElementById("spendingChart").getContext("2d");

    const spendingChart = new Chart(pieCtx, {
        type: "doughnut",
        data: {
            labels: [],
            datasets: [
                {
                    data: [],
                    backgroundColor: [
                        "#A8D5BA", "#C5CAE9", "#FFE0B2", "#FFAB91", "#D1C4E9",
                        "#80DEEA", "#C8E6C9", "#FFCC80", "#9FA8DA", "#B0BEC5",
                        "#D7CCC8", "#B39DDB", // Add more colors if needed
                    ],
                },
            ],
        },
        options: {
            responsive: true,
            cutout: '85%',
            plugins: {
                legend: {
                    position: "right",
                },
            },
        },
    });

    function calculateSavings() {
        let totalSavings = 0;
        const categories = [];
        const values = [];

        inputs.forEach((input, index) => {
            const category = input.placeholder.toLowerCase().replace(/ /g, "-");
            const spend = parseFloat(input.value) || 0;
            const savings = spend * 12 * (percentages[category] || 0);

            totalSavings += savings;
            spendSavingElements[index].textContent = `£${savings.toFixed(2)}`;

            if (spend > 0) {
                // Add to chart data
                categories.push(
                    category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
                );
                values.push(spend);
            }
        });

        updateChart(categories, values);
        document.getElementById("total-savings").textContent = `£${totalSavings.toFixed(2)}`;
    }

    function updateChart(categories, values) {
        spendingChart.data.labels = categories;
        spendingChart.data.datasets[0].data = values;
        spendingChart.update();
    }

    // Attach event listeners to all input fields
    inputs.forEach((input) => {
        input.addEventListener("input", calculateSavings);
    });

    calculateSavings(); // Initial calculation
});
