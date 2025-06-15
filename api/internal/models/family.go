package models

import (
	"errors"

	"github.com/google/uuid"
)

var (
	ErrFamilyAssociationNotFound = errors.New("family association not found")
)

type Family struct {
	SubscriptionID uuid.UUID
	Subscription   Subscription `gorm:"foreignKey:SubscriptionID;references:ID"`

	FriendID uuid.UUID
	Friend   Friend `gorm:"foreignKey:FriendID;references:ID"`
}

type AddFamilyMembersPayload struct {
	FriendIDs []string `json:"friend_ids" validate:"required,gt=0,dive,uuid"`
}

type DeleteFamilyMembersPayload struct {
	FamilyIDs []string `json:"family_ids" validate:"required,gt=0,dive,uuid"`
}

func (p *AddFamilyMembersPayload) ToFamilies(subscriptionID string) ([]*Family, error) {
	subID, err := uuid.Parse(subscriptionID)
	if err != nil {
		return nil, err
	}

	var families []*Family
	for _, friendID := range p.FriendIDs {
		parsedFriendID, err := uuid.Parse(friendID)
		if err != nil {
			return nil, err
		}

		family := &Family{
			SubscriptionID: subID,
			FriendID:       parsedFriendID,
		}
		families = append(families, family)
	}

	return families, nil
}
