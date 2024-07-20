document.addEventListener('DOMContentLoaded', function () {
    const drawButton = document.getElementById('draw');
    const drawResult = document.getElementById('drawResult');

    drawButton.addEventListener('click', async function () {
        try {
            // Fetch vouchers from the server
            const response = await fetch(
                `${window.location.origin}/api/voucher/`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "PatientJWTAuthToken"
                        )}`,
                        "Content-Type": "application/json",
                    },
                });
            if (!response.ok) {
                throw new Error('Failed to fetch vouchers');
            }
            const vouchers = await response.json();

            // Determine draw outcome based on fetched vouchers
            const outcome = Math.random() < 0.1; // Adjust probability as needed
            if (outcome && vouchers.length > 0) {
                // Select a random voucher from fetched vouchers
                const randomIndex = Math.floor(Math.random() * vouchers.length);
                const selectedVoucher = vouchers[randomIndex];

                // Display the selected voucher code
                drawResult.innerHTML = 
                `<p style="font-size: 1.5rem; font-weight: 600; color: #1f2937;">Congratulations! Your voucher code is: ${selectedVoucher.Code}<br>This voucher is worth $ ${selectedVoucher.Discount}</p>`;

                // Disable the draw button
                drawButton.disabled = true;
                drawButton.style.backgroundColor = "#d1d5db"; // Change button color to indicate it's disabled
                drawButton.style.cursor = "not-allowed"; // Change cursor to not-allowed
            } else {
                // Display try again message
                drawResult.innerHTML = `<p style="font-size: 1.5rem; font-weight: 600; color: #1f2937;">Try Again</p>`;
            }
        } catch (error) {
            console.error('Error:', error);
            drawResult.innerHTML = `<p style="font-size: 1.5rem; font-weight: 600; color: #1f2937;">Error fetching vouchers. Please try again later.</p>`;
        }
    });
});
