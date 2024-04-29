function ship(length) {
  let health = length;
  function hit() {
    if (health > 0) {
      --health;
    }
    return health;
  }
  function isSunk() {
    return health <= 0;
  }

  function getHealth() {
    if (isSunk()) {
      return 0;
    }
    return health;
  }

  function getLength() {
    return length;
  }

  return { hit, isSunk, getHealth, getLength };
}

module.exports = ship;
