CREATE OR REPLACE FUNCTION calculate_amortization_schedule()
RETURNS TABLE (
    payment_no INT,
    payment DECIMAL,
    principal_paid DECIMAL,
    interest_paid DECIMAL,
    remaining_balance DECIMAL
)
LANGUAGE plpgsql
AS $$
DECLARE
    original_loan_amount DECIMAL := 36000;
    current_balance DECIMAL := original_loan_amount;
    annual_interest_rate DECIMAL;
    monthly_interest_rate DECIMAL;
    total_months INT;
    monthly_payment DECIMAL;
    interest_paid DECIMAL;
    principal_paid DECIMAL;
    payment_no INT := 0;
BEGIN
    annual_interest_rate := 0.08;
    total_months := 36;
    monthly_interest_rate := annual_interest_rate / 12;
    monthly_payment := original_loan_amount * (monthly_interest_rate / (1 - (1 + monthly_interest_rate) ^ -total_months));

    CREATE TEMP TABLE spitzer_table (payment_no INT, payment DECIMAL, principal_paid DECIMAL, interest_paid DECIMAL, remaining_balance DECIMAL);

    LOOP
        payment_no := payment_no + 1;

        interest_paid := current_balance * monthly_interest_rate;
        principal_paid := monthly_payment - interest_paid;
        current_balance := current_balance - principal_paid;

        INSERT INTO spitzer_table VALUES (
            ROUND(payment_no, 2),
            ROUND(monthly_payment, 2),
            ROUND(principal_paid, 2),
            ROUND(interest_paid, 2),
            ROUND(current_balance, 2)
        );

        IF payment_no = 12 THEN
            annual_interest_rate := 0.045;
            total_months := payment_no + 48;
            monthly_interest_rate := annual_interest_rate / 12;
            monthly_payment := current_balance * (monthly_interest_rate / (1 - (1 + monthly_interest_rate) ^ -(total_months - payment_no)));
        END IF;

        EXIT WHEN payment_no = total_months;
    END LOOP;

    RETURN QUERY SELECT * FROM spitzer_table;

    DROP TABLE spitzer_table;
END;
$$;
