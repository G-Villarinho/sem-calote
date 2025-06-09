CREATE TABLE IF NOT EXISTS family (
    subscription_id VARCHAR(36) NOT NULL,
    friend_id VARCHAR(36) NOT NULL,
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE,
    FOREIGN KEY (friend_id) REFERENCES friends(id) ON DELETE CASCADE,
    PRIMARY KEY (subscription_id, friend_id)
);
