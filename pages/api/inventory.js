import prisma from "./../../prisma";

export default async function handler(req, res) {
    console.log("req:inventory by: ", req.query.userId);
  
    try {
      const userInventory = await prisma.userInventory.findFirst({
        where: {
          userId: req.query.userId,
        },
      });
  
      if (!userInventory) {
        res.status(404).json({ error: "User inventory not found" });
        return;
      }
  
      const usersInventory = Object.entries(userInventory).reduce((result, [key, value], index) => {
        if (key.startsWith("slot") && value) {
          const slotNumber = key.slice(-2); // Extract the last two characters (slot number)
          const slotValue = value;
  
          const {
            name,
            type,
            rarity,
            image,
            shop_value,
            tradeable,
            stackable,
            stackLimit,
            quantity,
          } = slotValue;
  
          result[`slot${slotNumber}`] = {
            name,
            type,
            rarity,
            image,
            shop_value,
            tradeable,
            stackable,
            stackLimit,
            quantity,
          };
        }
        return result;
      }, {});
      res.status(200).json(usersInventory);
    } catch (error) {
      console.error("Error fetching user inventory: ", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  