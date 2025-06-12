package models

import (
	"database/sql"
	"errors"
	"time"

	"github.com/google/uuid"
)

var (
	ErrFriendNotFound = errors.New("friend not found")
)

type Friend struct {
	ID        uuid.UUID `gorm:"type:varchar(36);primaryKey;"`
	Name      string
	Email     string
	CreatedAt time.Time
	UpdatedAt sql.NullTime
}

type FriendPayload struct {
	Name  string `json:"name" validate:"required"`
	Email string `json:"email" validate:"required,email"`
}

type FriendResponse struct {
	ID        uuid.UUID `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"created_at"`
}

func (p *FriendPayload) ToFriend() *Friend {
	return &Friend{
		Name:  p.Name,
		Email: p.Email,
	}
}

func (f *Friend) ToFriendResponse() *FriendResponse {
	return &FriendResponse{
		ID:        f.ID,
		Name:      f.Name,
		Email:     f.Email,
		CreatedAt: f.CreatedAt,
	}
}
