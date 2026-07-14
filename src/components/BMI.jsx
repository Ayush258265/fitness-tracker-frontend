import React, { useState, useEffect } from "react";

function BMI({ userId }) {
    const [bmi, setBmi] = useState(null);

    useEffect(() => {
        if (userId) {
            fetch(`http://localhost:8080/users/bmi/${userId}`)
                .then((res) => res.json())
                .then((data) => {
                    console.log("BMI API Response:", data);
                    setBmi(data);
                })
                .catch((err) => console.log(err));
        }
    }, [userId]);

    return (
        <div>
            <h2>BMI Detail</h2>

            {bmi ? (
                <div>
                    <h3>BMI: {bmi.bmi.toFixed(2)}</h3>
                    <h3>Category: {bmi.category}</h3>
                </div>
            ) : (
                <p>Loading BMI...</p>
            )}
        </div>
    );
}

export default BMI;