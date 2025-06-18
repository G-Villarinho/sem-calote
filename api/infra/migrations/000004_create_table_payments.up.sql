CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(36) PRIMARY KEY,
    subscription_id VARCHAR(36) NOT NULL,
    friend_id VARCHAR(36) NOT NULL,
    amount_in_cents INTEGER NOT NULL,
    status VARCHAR(15) NOT NULL CHECK(status IN ('PENDING', 'PAID', 'ERROR')),
    payment_link TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id),
    FOREIGN KEY (friend_id) REFERENCES friends(id)
);