package pkgs

import "github.com/google/uuid"

func ParseStringToUUID(uuidStr string) (uuid.UUID, error) {
	if uuidStr == "" {
		return uuid.Nil, nil
	}

	id, err := uuid.Parse(uuidStr)
	if err != nil {
		return uuid.Nil, err
	}

	return id, nil
}
