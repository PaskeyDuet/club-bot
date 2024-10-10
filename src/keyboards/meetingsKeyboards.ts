import { InlineKeyboard } from "grammy";
import { MeetingsObject } from "../types/shared.types";
import { mainMenu } from "./generalKeyboards";
// import config from "../botConfig/generalConfig";

export const generateMeetingsKeyboard = (
  meetings: MeetingsObject[]
): InlineKeyboard => {
  const keyboard = new InlineKeyboard();
  meetings.forEach((el, inx) => {
    const date = el.date.replace(/202.*$/, "");
    const keyboardText = `${inx + 1}. ${date} - ${el.topic}`;
    keyboard.text(keyboardText, `reg_for_meeting_${el.meetingId}`).row();
  });
  return keyboard.text("Главное меню", "main_menu");
};

// export function generateCartItemsMenu(cart, currentPage, maxPerMessage = config.maxmeetingsPerMessage) {
// 	let cartItemsMenu = new InlineKeyboard();

// 	if (currentPage === 1) {
// 	    let range;

// 	    if (cart.length == 1) {
// 		   range = cart.length;
// 	    } else {
// 		   range = cart.length - 1 < maxPerMessage ? cart.length : maxPerMessage;
// 	    }

// 	    for (let i = 0; i < range; i++) {
// 		   cartItemsMenu
// 			  .text(
// 				 `${getEmoji(cart[i].subType)}  ${cart[i].name}`,
// 				 `cart__check_${cart[i].dbId}`
// 			  )
// 			  .row();
// 	    }

// 	    cartItemsMenu.text("‹ Назад", "cart__enter");

// 	    if (cart.length > maxPerMessage) {
// 		   cartItemsMenu.text("Дальше ›", "cart__nav_next");
// 	    }
// 	} else {
// 	    let isItemsEnd = false;
// 	    const range = currentPage * maxPerMessage;
// 	    for (let i = range - maxPerMessage; i <= range; i++) {
// 		   if (cart[i]?.dbId && !isItemsEnd) {
// 			  cartItemsMenu
// 				 .text(
// 					`${getEmoji(cart[i].subType)}  ${cart[i].name}`,
// 					`cart__check_${cart[i].dbId}`
// 				 )
// 				 .row();
// 		   } else {
// 			  isItemsEnd = true;
// 		   }
// 	    }

// 	    if (!isItemsEnd) {
// 		   cartItemsMenu.text("‹ Назад", "cart__nav_back").text("Дальше ›", "cart__nav_next");
// 	    } else {
// 		   cartItemsMenu.text("‹ Назад", "cart__nav_back");
// 	    }
// 	}

// 	return cartItemsMenu;
//  }
