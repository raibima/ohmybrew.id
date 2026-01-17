import { initBotId } from "botid/client/core";

// Bot protection is now handled in Server Actions directly
initBotId({
  protect: [],
});
