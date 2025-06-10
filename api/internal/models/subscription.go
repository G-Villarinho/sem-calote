package models

import (
	"time"

	"github.com/google/uuid"
)

type Subscription struct {
	ID                uuid.UUID
	Name              string
	TotalPriceInCents int64
	DueDay            int
	CreatedAt         time.Time
}

type CreateSubscriptionPayload struct {
	Name       string  `json:"name" validate:"required"`
	TotalPrice float64 `json:"total_price" validate:"required"`
	DueDay     int     `json:"due_day" validate:"required"`
}

type SubscriptionResponse struct {
	ID         uuid.UUID `json:"id"`
	Name       string    `json:"name"`
	TotalPrice float64   `json:"total_price"`
	DueDay     int       `json:"due_day"`
	CreatedAt  time.Time `json:"created_at"`
}

func (p *CreateSubscriptionPayload) ToSubscription() *Subscription {
	return &Subscription{
		Name:              p.Name,
		TotalPriceInCents: int64(p.TotalPrice * 100),
		DueDay:            p.DueDay,
	}
}

func (s *Subscription) ToSubscriptionResponse() *SubscriptionResponse {
	return &SubscriptionResponse{
		ID:         s.ID,
		Name:       s.Name,
		TotalPrice: float64(s.TotalPriceInCents) / 100,
		DueDay:     s.DueDay,
		CreatedAt:  s.CreatedAt,
	}
}
