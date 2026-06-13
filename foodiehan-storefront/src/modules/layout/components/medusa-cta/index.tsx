import { Text } from "@medusajs/ui"

import Medusa from "../../../common/icons/medusa"
import NextJs from "../../../common/icons/nextjs"

const MedusaCTA = () => {
  return (
    <Text className="flex items-center gap-x-2 txt-compact-small-plus">
      © {new Date().getFullYear()} FoodieHan. All rights reserved.
    </Text>
  )
}

export default MedusaCTA
