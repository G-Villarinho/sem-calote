package models

import (
	"errors"
	"time"

	"github.com/g-villarinho/sem-calote/api/internal/billing"
	"github.com/google/uuid"
)

var (
	ErrSubscriptionNotFound = errors.New("subscription not found")
)

type Subscription struct {
	ID                uuid.UUID `gorm:"type:varchar(36);primaryKey;"`
	Name              string
	TotalPriceInCents int64
	DueDay            int
	CreatedAt         time.Time

	Friends []*Friend `gorm:"many2many:family;"`
}

type SubscriptionPayload struct {
	Name       string  `json:"name" validate:"required"`
	TotalPrice float64 `json:"total_price" validate:"required"`
	DueDay     int     `json:"due_day" validate:"required"`
}

type SubscriptionResponse struct {
	ID              uuid.UUID        `json:"id"`
	Name            string           `json:"name"`
	TotalPrice      float64          `json:"total_price"`
	NextBillingDate time.Time        `json:"next_billing_date"`
	DaysLeft        int              `json:"days_left"`
	DueDay          int              `json:"due_day"`
	Friends         []FriendResponse `json:"friends"`
	CreatedAt       time.Time        `json:"created_at"`
}

func (p *SubscriptionPayload) ToSubscription() *Subscription {
	return &Subscription{
		Name:              p.Name,
		TotalPriceInCents: int64(p.TotalPrice * 100),
		DueDay:            p.DueDay,
	}
}

func (s *Subscription) ToSubscriptionResponse() *SubscriptionResponse {
	friendsResponse := make([]FriendResponse, 0, len(s.Friends))
	for _, friend := range s.Friends {
		friendsResponse = append(friendsResponse, *friend.ToFriendResponse())
	}

	nextBillingDate := billing.CalculateNextDate(s.CreatedAt, s.DueDay)
	daysLeft := billing.CalculateDaysLeft(nextBillingDate)

	return &SubscriptionResponse{
		ID:              s.ID,
		Name:            s.Name,
		TotalPrice:      float64(s.TotalPriceInCents) / 100,
		NextBillingDate: nextBillingDate,
		DaysLeft:        daysLeft,
		DueDay:          s.DueDay,
		Friends:         friendsResponse,
		CreatedAt:       s.CreatedAt,
	}
}
