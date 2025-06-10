package models

import (
	"time"

	"github.com/google/uuid"
)

type Friend struct {
	ID        uuid.UUID
	Name      string
	Email     string
	CreatedAt time.Time
}

type CreateFriendPayload struct {
	Name  string `json:"name" validate:"required"`
	Email string `json:"email" validate:"required,email"`
}

type FriendResponse struct {
	ID    uuid.UUID `json:"id"`
	Name  string    `json:"name"`
	Email string    `json:"email"`
}

func (p *CreateFriendPayload) ToFriend() *Friend {
	return &Friend{
		Name:  p.Name,
		Email: p.Email,
	}
}

func (f *Friend) ToFriendResponse() *FriendResponse {
	return &FriendResponse{
		ID:    f.ID,
		Name:  f.Name,
		Email: f.Email,
	}
}
