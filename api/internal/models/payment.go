package models

import (
	"database/sql"
	"time"

	"github.com/google/uuid"
)

type PaymentStatus string

const (
	PaymentStatusPending PaymentStatus = "PENDING"
	PaymentStatusPaid    PaymentStatus = "PAID"
	PaymentStatusError   PaymentStatus = "ERROR"
)

type Payment struct {
	ID            uuid.UUID
	AmountInCents int64
	Status        PaymentStatus
	CreatedAt     time.Time
	UpdatedAt     sql.NullTime
	PaidAt        sql.NullTime

	SubscriptionID uuid.UUID
	Subscription   *Subscription `gorm:"foreignKey:SubscriptionID;references:ID"`

	FriendID uuid.UUID
	Friend   *Friend `gorm:"foreignKey:FriendID;references:ID"`
}

type CreatePaymentInput struct {
	SubscriptionID uuid.UUID
	Title          string
	PriceInCents   int64
	FriendID       uuid.UUID
}
