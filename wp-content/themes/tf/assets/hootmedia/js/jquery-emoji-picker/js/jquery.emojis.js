(function($) {
  $.fn.emojiPicker.emojis = [
    {
      "name": "grinning",
      "unicode": {"apple":"1F600", "google":"1F600", "twitter":"1F600"},
      "shortcode": "grinning",
      "description": "GRINNING FACE",
      "category": "people"
    },
    {
      "name": "grin",
      "unicode": {"apple":"1F601", "google":"1F601", "twitter":"1F601"},
      "shortcode": "grin",
      "description": "GRINNING FACE WITH SMILING EYES",
      "category": "people"
    },
    {
      "name": "grimacing",
      "unicode": {"apple":"1F62C", "google":"1F62C", "twitter":"1F62C"},
      "shortcode": "grimacing",
      "description": "GRIMACING FACE",
      "category": "people"
    },
    {
      "name": "joy",
      "unicode": {"apple":"1F602", "google":"1F602", "twitter":"1F602"},
      "shortcode": "joy",
      "description": "FACE WITH TEARS OF JOY",
      "category": "people"
    },
    {
      "name": "smiley",
      "unicode": {"apple":"1F603", "google":"1F603", "twitter":"1F603"},
      "shortcode": "smiley",
      "description": "SMILING FACE WITH OPEN MOUTH",
      "category": "people"
    },
    {
      "name": "smile",
      "unicode": {"apple":"1F604", "google":"1F604", "twitter":"1F604"},
      "shortcode": "smile",
      "description": "SMILING FACE WITH OPEN MOUTH AND SMILING EYES",
      "category": "people"
    },
    {
      "name": "sweat_smile",
      "unicode": {"apple":"1F605", "google":"1F605", "twitter":"1F605"},
      "shortcode": "sweat_smile",
      "description": "SMILING FACE WITH OPEN MOUTH AND COLD SWEAT",
      "category": "people"
    },
    {
      "name": "laughing",
      "unicode": {"apple":"1F606", "google":"1F606", "twitter":"1F606"},
      "shortcode": "laughing",
      "description": "SMILING FACE WITH OPEN MOUTH AND TIGHTLY-CLOSED EYES",
      "category": "people"
    },
    {
      "name": "innocent",
      "unicode": {"apple":"1F607", "google":"1F607", "twitter":"1F607"},
      "shortcode": "innocent",
      "description": "SMILING FACE WITH HALO",
      "category": "people"
    },
    {
      "name": "wink",
      "unicode": {"apple":"1F609", "google":"1F609", "twitter":"1F609"},
      "shortcode": "wink",
      "description": "WINKING FACE",
      "category": "people"
    },
    {
      "name": "blush",
      "unicode": {"apple":"1F60A", "google":"1F60A", "twitter":"1F60A"},
      "shortcode": "blush",
      "description": "SMILING FACE WITH SMILING EYES",
      "category": "people"
    },
    {
      "name": "slightly_smiling_face",
      "unicode": {"apple":"1F642", "google":"1F642", "twitter":"1F642"},
      "shortcode": "slightly_smiling_face",
      "description": "slightly smiling face",
      "category": "people"
    },
    {
      "name": "upside_down_face",
      "unicode": {"apple":"1F643", "google":"1F643", "twitter":"1F643"},
      "shortcode": "upside_down_face",
      "description": "upside-down face",
      "category": "people"
    },
    {
      "name": "relaxed",
      "unicode": {"apple":"263A", "google":"263A", "twitter":"263A"},
      "shortcode": "relaxed",
      "description": "WHITE SMILING FACE",
      "category": "people"
    },
    {
      "name": "yum",
      "unicode": {"apple":"1F60B", "google":"1F60B", "twitter":"1F60B"},
      "shortcode": "yum",
      "description": "FACE SAVOURING DELICIOUS FOOD",
      "category": "people"
    },
    {
      "name": "relieved",
      "unicode": {"apple":"1F60C", "google":"1F60C", "twitter":"1F60C"},
      "shortcode": "relieved",
      "description": "RELIEVED FACE",
      "category": "people"
    },
    {
      "name": "heart_eyes",
      "unicode": {"apple":"1F60D", "google":"1F60D", "twitter":"1F60D"},
      "shortcode": "heart_eyes",
      "description": "SMILING FACE WITH HEART-SHAPED EYES",
      "category": "people"
    },
    {
      "name": "kissing_heart",
      "unicode": {"apple":"1F618", "google":"1F618", "twitter":"1F618"},
      "shortcode": "kissing_heart",
      "description": "FACE THROWING A KISS",
      "category": "people"
    },
    {
      "name": "kissing",
      "unicode": {"apple":"1F617", "google":"1F617", "twitter":"1F617"},
      "shortcode": "kissing",
      "description": "KISSING FACE",
      "category": "people"
    },
    {
      "name": "kissing_smiling_eyes",
      "unicode": {"apple":"1F619", "google":"1F619", "twitter":"1F619"},
      "shortcode": "kissing_smiling_eyes",
      "description": "KISSING FACE WITH SMILING EYES",
      "category": "people"
    },
    {
      "name": "kissing_closed_eyes",
      "unicode": {"apple":"1F61A", "google":"1F61A", "twitter":"1F61A"},
      "shortcode": "kissing_closed_eyes",
      "description": "KISSING FACE WITH CLOSED EYES",
      "category": "people"
    },
    {
      "name": "stuck_out_tongue_winking_eye",
      "unicode": {"apple":"1F61C", "google":"1F61C", "twitter":"1F61C"},
      "shortcode": "stuck_out_tongue_winking_eye",
      "description": "FACE WITH STUCK-OUT TONGUE AND WINKING EYE",
      "category": "people"
    },
    {
      "name": "stuck_out_tongue_closed_eyes",
      "unicode": {"apple":"1F61D", "google":"1F61D", "twitter":"1F61D"},
      "shortcode": "stuck_out_tongue_closed_eyes",
      "description": "FACE WITH STUCK-OUT TONGUE AND TIGHTLY-CLOSED EYES",
      "category": "people"
    },
    {
      "name": "stuck_out_tongue",
      "unicode": {"apple":"1F61B", "google":"1F61B", "twitter":"1F61B"},
      "shortcode": "stuck_out_tongue",
      "description": "FACE WITH STUCK-OUT TONGUE",
      "category": "people"
    },
    {
      "name": "money_mouth_face",
      "unicode": {"apple":"1F911", "google":"1F911", "twitter":"1F911"},
      "shortcode": "money_mouth_face",
      "description": "Money-Mouth Face",
      "category": "people"
    },
    {
      "name": "nerd_face",
      "unicode": {"apple":"1F913", "google":"1F913", "twitter":"1F913"},
      "shortcode": "nerd_face",
      "description": "Nerd Face",
      "category": "people"
    },
    {
      "name": "sunglasses",
      "unicode": {"apple":"", "google":"", "twitter":"1F60E"},
      "shortcode": "sunglasses",
      "description": "SMILING FACE WITH SUNGLASSES",
      "category": "people"
    },
    {
      "name": "hugging_face",
      "unicode": {"apple":"1F917", "google":"1F917", "twitter":"1F917"},
      "shortcode": "hugging_face",
      "description": "Hugging Face",
      "category": "people"
    },
    {
      "name": "smirk",
      "unicode": {"apple":"1F60F", "google":"1F60F", "twitter":"1F60F"},
      "shortcode": "smirk",
      "description": "SMIRKING FACE",
      "category": "people"
    },
    {
      "name": "no_mouth",
      "unicode": {"apple":"1F636", "google":"1F636", "twitter":"1F636"},
      "shortcode": "no_mouth",
      "description": "FACE WITHOUT MOUTH",
      "category": "people"
    },
    {
      "name": "neutral_face",
      "unicode": {"apple":"1F610", "google":"1F610", "twitter":"1F610"},
      "shortcode": "neutral_face",
      "description": "NEUTRAL FACE",
      "category": "people"
    },
    {
      "name": "expressionless",
      "unicode": {"apple":"1F611", "google":"1F611", "twitter":"1F611"},
      "shortcode": "expressionless",
      "description": "EXPRESSIONLESS FACE",
      "category": "people"
    },
    {
      "name": "unamused",
      "unicode": {"apple":"1F612", "google":"1F612", "twitter":"1F612"},
      "shortcode": "unamused",
      "description": "UNAMUSED FACE",
      "category": "people"
    },
    {
      "name": "face_with_rolling_eyes",
      "unicode": {"apple":"1F644", "google":"1F644", "twitter":"1F644"},
      "shortcode": "face_with_rolling_eyes",
      "description": "Face With Rolling Eyes",
      "category": "people"
    },
    {
      "name": "thinking_face",
      "unicode": {"apple":"1F914", "google":"1F914", "twitter":"1F914"},
      "shortcode": "thinking_face",
      "description": "Thinking Face",
      "category": "people"
    },
    {
      "name": "flushed",
      "unicode": {"apple":"1F633", "google":"1F633", "twitter":"1F633"},
      "shortcode": "flushed",
      "description": "FLUSHED FACE",
      "category": "people"
    },
    {
      "name": "disappointed",
      "unicode": {"apple":"1F61E", "google":"1F61E", "twitter":"1F61E"},
      "shortcode": "disappointed",
      "description": "DISAPPOINTED FACE",
      "category": "people"
    },
    {
      "name": "worried",
      "unicode": {"apple":"1F61F", "google":"1F61F", "twitter":"1F61F"},
      "shortcode": "worried",
      "description": "WORRIED FACE",
      "category": "people"
    },
    {
      "name": "angry",
      "unicode": {"apple":"1F620", "google":"1F620", "twitter":"1F620"},
      "shortcode": "angry",
      "description": "ANGRY FACE",
      "category": "people"
    },
    {
      "name": "rage",
      "unicode": {"apple":"1F621", "google":"1F621", "twitter":"1F621"},
      "shortcode": "rage",
      "description": "POUTING FACE",
      "category": "people"
    },
    {
      "name": "pensive",
      "unicode": {"apple":"1F614", "google":"1F614", "twitter":"1F614"},
      "shortcode": "pensive",
      "description": "PENSIVE FACE",
      "category": "people"
    },
    {
      "name": "confused",
      "unicode": {"apple":"1F615", "google":"1F615", "twitter":"1F615"},
      "shortcode": "confused",
      "description": "CONFUSED FACE",
      "category": "people"
    },
    {
      "name": "slightly_frowning_face",
      "unicode": {"apple":"1F641", "google":"1F641", "twitter":"1F641"},
      "shortcode": "slightly_frowning_face",
      "description": "slightly frowning face",
      "category": "people"
    },
    {
      "name": "white_frowning_face",
      "unicode": {"apple":"2639", "google":"2639", "twitter":"2639"},
      "shortcode": "white_frowning_face",
      "description": "white frowning face",
      "category": "people"
    },
    {
      "name": "persevere",
      "unicode": {"apple":"1F623", "google":"1F623", "twitter":"1F623"},
      "shortcode": "persevere",
      "description": "PERSEVERING FACE",
      "category": "people"
    },
    {
      "name": "confounded",
      "unicode": {"apple":"1F616", "google":"1F616", "twitter":"1F616"},
      "shortcode": "confounded",
      "description": "CONFOUNDED FACE",
      "category": "people"
    },
    {
      "name": "tired_face",
      "unicode": {"apple":"1F62B", "google":"1F62B", "twitter":"1F62B"},
      "shortcode": "tired_face",
      "description": "TIRED FACE",
      "category": "people"
    },
    {
      "name": "weary",
      "unicode": {"apple":"1F629", "google":"1F629", "twitter":"1F629"},
      "shortcode": "weary",
      "description": "WEARY FACE",
      "category": "people"
    },
    {
      "name": "triumph",
      "unicode": {"apple":"1F624", "google":"1F624", "twitter":"1F624"},
      "shortcode": "triumph",
      "description": "FACE WITH LOOK OF TRIUMPH",
      "category": "people"
    },
    {
      "name": "open_mouth",
      "unicode": {"apple":"1F62E", "google":"1F62E", "twitter":"1F62E"},
      "shortcode": "open_mouth",
      "description": "FACE WITH OPEN MOUTH",
      "category": "people"
    },
    {
      "name": "scream",
      "unicode": {"apple":"1F631", "google":"1F631", "twitter":"1F631"},
      "shortcode": "scream",
      "description": "FACE SCREAMING IN FEAR",
      "category": "people"
    },
    {
      "name": "fearful",
      "unicode": {"apple":"1F628", "google":"1F628", "twitter":"1F628"},
      "shortcode": "fearful",
      "description": "FEARFUL FACE",
      "category": "people"
    },
    {
      "name": "cold_sweat",
      "unicode": {"apple":"1F630", "google":"1F630", "twitter":"1F630"},
      "shortcode": "cold_sweat",
      "description": "FACE WITH OPEN MOUTH AND COLD SWEAT",
      "category": "people"
    },
    {
      "name": "hushed",
      "unicode": {"apple":"1F62F", "google":"1F62F", "twitter":"1F62F"},
      "shortcode": "hushed",
      "description": "HUSHED FACE",
      "category": "people"
    },
    {
      "name": "frowning",
      "unicode": {"apple":"1F626", "google":"1F626", "twitter":"1F626"},
      "shortcode": "frowning",
      "description": "FROWNING FACE WITH OPEN MOUTH",
      "category": "people"
    },
    {
      "name": "anguished",
      "unicode": {"apple":"1F627", "google":"1F627", "twitter":"1F627"},
      "shortcode": "anguished",
      "description": "ANGUISHED FACE",
      "category": "people"
    },
    {
      "name": "cry",
      "unicode": {"apple":"1F622", "google":"1F622", "twitter":"1F622"},
      "shortcode": "cry",
      "description": "CRYING FACE",
      "category": "people"
    },
    {
      "name": "disappointed_relieved",
      "unicode": {"apple":"1F625", "google":"1F625", "twitter":"1F625"},
      "shortcode": "disappointed_relieved",
      "description": "DISAPPOINTED BUT RELIEVED FACE",
      "category": "people"
    },
    {
      "name": "sleepy",
      "unicode": {"apple":"1F62A", "google":"1F62A", "twitter":"1F62A"},
      "shortcode": "sleepy",
      "description": "SLEEPY FACE",
      "category": "people"
    },
    {
      "name": "sweat",
      "unicode": {"apple":"1F613", "google":"1F613", "twitter":"1F613"},
      "shortcode": "sweat",
      "description": "FACE WITH COLD SWEAT",
      "category": "people"
    },
    {
      "name": "sob",
      "unicode": {"apple":"1F62D", "google":"1F62D", "twitter":"1F62D"},
      "shortcode": "sob",
      "description": "LOUDLY CRYING FACE",
      "category": "people"
    },
    {
      "name": "dizzy_face",
      "unicode": {"apple":"1F635", "google":"1F635", "twitter":"1F635"},
      "shortcode": "dizzy_face",
      "description": "DIZZY FACE",
      "category": "people"
    },
    {
      "name": "astonished",
      "unicode": {"apple":"1F632", "google":"1F632", "twitter":"1F632"},
      "shortcode": "astonished",
      "description": "ASTONISHED FACE",
      "category": "people"
    },
    {
      "name": "zipper_mouth_face",
      "unicode": {"apple":"1F910", "google":"1F910", "twitter":"1F910"},
      "shortcode": "zipper_mouth_face",
      "description": "Zipper-Mouth Face",
      "category": "people"
    },
    {
      "name": "mask",
      "unicode": {"apple":"1F637", "google":"1F637", "twitter":"1F637"},
      "shortcode": "mask",
      "description": "FACE WITH MEDICAL MASK",
      "category": "people"
    },
    {
      "name": "face_with_thermometer",
      "unicode": {"apple":"1F912", "google":"1F912", "twitter":"1F912"},
      "shortcode": "face_with_thermometer",
      "description": "Face With Thermometer",
      "category": "people"
    },
    {
      "name": "face_with_head_bandage",
      "unicode": {"apple":"1F915", "google":"1F915", "twitter":"1F915"},
      "shortcode": "face_with_head_bandage",
      "description": "Face With Head-Bandage",
      "category": "people"
    },
    {
      "name": "sleeping",
      "unicode": {"apple":"1F634", "google":"1F634", "twitter":"1F634"},
      "shortcode": "sleeping",
      "description": "SLEEPING FACE",
      "category": "people"
    },
    {
      "name": "zzz",
      "unicode": {"apple":"1F4A4", "google":"1F4A4", "twitter":"1F4A4"},
      "shortcode": "zzz",
      "description": "SLEEPING SYMBOL",
      "category": "people"
    },
    {
      "name": "hankey",
      "keywords": ["poop", "poo"],
      "unicode": {"apple":"1F4A9", "google":"1F4A9", "twitter":"1F4A9"},
      "shortcode": "hankey",
      "description": "PILE OF POO",
      "category": "people"
    },
    {
      "name": "smiling_imp",
      "unicode": {"apple":"1F608", "google":"1F608", "twitter":"1F608"},
      "shortcode": "smiling_imp",
      "description": "SMILING FACE WITH HORNS",
      "category": "people"
    },
    {
      "name": "imp",
      "unicode": {"apple":"1F47F", "google":"1F47F", "twitter":"1F47F"},
      "shortcode": "imp",
      "description": "IMP",
      "category": "people"
    },
    {
      "name": "japanese_ogre",
      "unicode": {"apple":"1F479", "google":"1F479", "twitter":"1F479"},
      "shortcode": "japanese_ogre",
      "description": "JAPANESE OGRE",
      "category": "people"
    },
    {
      "name": "japanese_goblin",
      "unicode": {"apple":"1F47A", "google":"1F47A", "twitter":"1F47A"},
      "shortcode": "japanese_goblin",
      "description": "JAPANESE GOBLIN",
      "category": "people"
    },
    {
      "name": "skull",
      "unicode": {"apple":"1F480", "google":"1F480", "twitter":"1F480"},
      "shortcode": "skull",
      "description": "SKULL",
      "category": "people"
    },
    {
      "name": "ghost",
      "unicode": {"apple":"1F47B", "google":"1F47B", "twitter":"1F47B"},
      "shortcode": "ghost",
      "description": "GHOST",
      "category": "people"
    },
    {
      "name": "alien",
      "unicode": {"apple":"1F47D", "google":"1F47D", "twitter":"1F47D"},
      "shortcode": "alien",
      "description": "EXTRATERRESTRIAL ALIEN",
      "category": "people"
    },
    {
      "name": "robot_face",
      "unicode": {"apple":"1F916", "google":"1F916", "twitter":"1F916"},
      "shortcode": "robot_face",
      "description": "Robot Face",
      "category": "people"
    },
    {
      "name": "smiley_cat",
      "unicode": {"apple":"1F63A", "google":"1F63A", "twitter":"1F63A"},
      "shortcode": "smiley_cat",
      "description": "SMILING CAT FACE WITH OPEN MOUTH",
      "category": "people"
    },
    {
      "name": "smile_cat",
      "unicode": {"apple":"1F638", "google":"1F638", "twitter":"1F638"},
      "shortcode": "smile_cat",
      "description": "GRINNING CAT FACE WITH SMILING EYES",
      "category": "people"
    },
    {
      "name": "joy_cat",
      "unicode": {"apple":"1F639", "google":"1F639", "twitter":"1F639"},
      "shortcode": "joy_cat",
      "description": "CAT FACE WITH TEARS OF JOY",
      "category": "people"
    },
    {
      "name": "heart_eyes_cat",
      "unicode": {"apple":"1F63B", "google":"1F63B", "twitter":"1F63B"},
      "shortcode": "heart_eyes_cat",
      "description": "SMILING CAT FACE WITH HEART-SHAPED EYES",
      "category": "people"
    },
    {
      "name": "smirk_cat",
      "unicode": {"apple":"1F63C", "google":"1F63C", "twitter":"1F63C"},
      "shortcode": "smirk_cat",
      "description": "CAT FACE WITH WRY SMILE",
      "category": "people"
    },
    {
      "name": "kissing_cat",
      "unicode": {"apple":"1F63D", "google":"1F63D", "twitter":"1F63D"},
      "shortcode": "kissing_cat",
      "description": "KISSING CAT FACE WITH CLOSED EYES",
      "category": "people"
    },
    {
      "name": "scream_cat",
      "unicode": {"apple":"1F640", "google":"1F640", "twitter":"1F640"},
      "shortcode": "scream_cat",
      "description": "WEARY CAT FACE",
      "category": "people"
    },
    {
      "name": "crying_cat_face",
      "unicode": {"apple":"1F63F", "google":"1F63F", "twitter":"1F63F"},
      "shortcode": "crying_cat_face",
      "description": "CRYING CAT FACE",
      "category": "people"
    },
    {
      "name": "pouting_cat",
      "unicode": {"apple":"1F63E", "google":"1F63E", "twitter":"1F63E"},
      "shortcode": "pouting_cat",
      "description": "POUTING CAT FACE",
      "category": "people"
    },
    {
      "name": "raised_hands",
      "unicode": {"apple":"1F64C", "google":"1F64C", "twitter":"1F64C"},
      "shortcode": "raised_hands",
      "description": "PERSON RAISING BOTH HANDS IN CELEBRATION",
      "category": "people"
    },
    {
      "name": "clap",
      "unicode": {"apple":"1F44F", "google":"1F44F", "twitter":"1F44F"},
      "shortcode": "clap",
      "description": "CLAPPING HANDS SIGN",
      "category": "people"
    },
    {
      "name": "wave",
      "unicode": {"apple":"1F44B", "google":"1F44B", "twitter":"1F44B"},
      "shortcode": "wave",
      "description": "WAVING HAND SIGN",
      "category": "people"
    },
    {
      "name": "+1",
      "keywords": ["thumbsup"],
      "unicode": {"apple":"1F44D", "google":"1F44D", "twitter":"1F44D"},
      "shortcode": "plus1",
      "description": "THUMBS UP SIGN",
      "category": "people"
    },
    {
      "name": "-1",
      "keywords": ["thumbsdown"],
      "unicode": {"apple":"1F44E", "google":"1F44E", "twitter":"1F44E"},
      "shortcode": "-1",
      "description": "THUMBS DOWN SIGN",
      "category": "people"
    },
    {
      "name": "facepunch",
      "unicode": {"apple":"1F44A", "google":"1F44A", "twitter":"1F44A"},
      "shortcode": "facepunch",
      "description": "FISTED HAND SIGN",
      "category": "people"
    },
    {
      "name": "fist",
      "unicode": {"apple":"270A", "google":"270A", "twitter":"270A"},
      "shortcode": "fist",
      "description": "RAISED FIST",
      "category": "people"
    },
    {
      "name": "v",
      "unicode": {"apple":"270C", "google":"270C", "twitter":"270C"},
      "shortcode": "v",
      "description": "VICTORY HAND",
      "category": "people"
    },
    {
      "name": "ok_hand",
      "unicode": {"apple":"1F44C", "google":"1F44C", "twitter":"1F44C"},
      "shortcode": "ok_hand",
      "description": "OK HAND SIGN",
      "category": "people"
    },
    {
      "name": "hand",
      "unicode": {"apple":"270B", "google":"270B", "twitter":"270B"},
      "shortcode": "hand",
      "description": "RAISED HAND",
      "category": "people"
    },
    {
      "name": "open_hands",
      "unicode": {"apple":"1F450", "google":"1F450", "twitter":"1F450"},
      "shortcode": "open_hands",
      "description": "OPEN HANDS SIGN",
      "category": "people"
    },
    {
      "name": "muscle",
      "unicode": {"apple":"1F4AA", "google":"1F4AA", "twitter":"1F4AA"},
      "shortcode": "muscle",
      "description": "FLEXED BICEPS",
      "category": "people"
    },
    {
      "name": "pray",
      "unicode": {"apple":"1F64F", "google":"1F64F", "twitter":"1F64F"},
      "shortcode": "pray",
      "description": "PERSON WITH FOLDED HANDS",
      "category": "people"
    },
    {
      "name": "point_up",
      "unicode": {"apple":"261D", "google":"261D", "twitter":"261D"},
      "shortcode": "point_up",
      "description": "WHITE UP POINTING INDEX",
      "category": "people"
    },
    {
      "name": "point_up_2",
      "unicode": {"apple":"1F446", "google":"1F446", "twitter":"1F446"},
      "shortcode": "point_up_2",
      "description": "WHITE UP POINTING BACKHAND INDEX",
      "category": "people"
    },
    {
      "name": "point_down",
      "unicode": {"apple":"1F447", "google":"1F447", "twitter":"1F447"},
      "shortcode": "point_down",
      "description": "WHITE DOWN POINTING BACKHAND INDEX",
      "category": "people"
    },
    {
      "name": "point_left",
      "unicode": {"apple":"1F448", "google":"1F448", "twitter":"1F448"},
      "shortcode": "point_left",
      "description": "WHITE LEFT POINTING BACKHAND INDEX",
      "category": "people"
    },
    {
      "name": "point_right",
      "unicode": {"apple":"1F449", "google":"1F449", "twitter":"1F449"},
      "shortcode": "point_right",
      "description": "WHITE RIGHT POINTING BACKHAND INDEX",
      "category": "people"
    },
    {
      "name": "middle_finger",
      "keywords": ["reversed_hand_with_middle_finger_extended"],
      "unicode": {"apple":"1F595", "google":"1F595", "twitter":"1F595"},
      "shortcode": "middle_finger",
      "description": "Reversed Hand With Middle Finger Extended",
      "category": "people"
    },
    {
      "name": "raised_hand_with_fingers_splayed",
      "unicode": {"apple":"1F590", "google":"1F590", "twitter":"1F590"},
      "shortcode": "raised_hand_with_fingers_splayed",
      "description": "Raised Hand With Fingers Splayed",
      "category": "people"
    },
    {
      "name": "the_horns",
      "keywords": ["sign_of_the_horns"],
      "unicode": {"apple":"1F918", "google":"1F918", "twitter":"1F918"},
      "shortcode": "the_horns",
      "description": "Sign of the Horns",
      "category": "people"
    },
    {
      "name": "spock-hand",
      "unicode": {"apple":"1F596", "google":"1F596", "twitter":"1F596"},
      "shortcode": "spock-hand",
      "description": "Raised Hand With Part Between Middle and Ring Fingers",
      "category": "people"
    },
    {
      "name": "writing_hand",
      "unicode": {"apple":"270D", "google":"270D", "twitter":"270D"},
      "shortcode": "writing_hand",
      "description": "Writing Hand",
      "category": "people"
    },
    {
      "name": "nail_care",
      "unicode": {"apple":"1F485", "google":"1F485", "twitter":"1F485"},
      "shortcode": "nail_care",
      "description": "NAIL POLISH",
      "category": "people"
    },
    {
      "name": "lips",
      "unicode": {"apple":"1F444", "google":"1F444", "twitter":"1F444"},
      "shortcode": "lips",
      "description": "MOUTH",
      "category": "people"
    },
    {
      "name": "tongue",
      "unicode": {"apple":"1F445", "google":"1F445", "twitter":"1F445"},
      "shortcode": "tongue",
      "description": "TONGUE",
      "category": "people"
    },
    {
      "name": "ear",
      "unicode": {"apple":"1F442", "google":"1F442", "twitter":"1F442"},
      "shortcode": "ear",
      "description": "EAR",
      "category": "people"
    },
    {
      "name": "nose",
      "unicode": {"apple":"1F443", "google":"1F443", "twitter":"1F443"},
      "shortcode": "nose",
      "description": "NOSE",
      "category": "people"
    },
    {
      "name": "eye",
      "unicode": {"apple":"1F441", "google":"1F441", "twitter":"1F441"},
      "shortcode": "eye",
      "description": "EYE",
      "category": "people"
    },
    {
      "name": "eyes",
      "unicode": {"apple":"", "google":"", "twitter":"1F440"},
      "shortcode": "eyes",
      "description": "EYES",
      "category": "people"
    },
    {
      "name": "bust_in_silhouette",
      "unicode": {"apple":"1F464", "google":"1F464", "twitter":"1F464"},
      "shortcode": "bust_in_silhouette",
      "description": "BUST IN SILHOUETTE",
      "category": "people"
    },
    {
      "name": "busts_in_silhouette",
      "unicode": {"apple":"1F465", "google":"1F465", "twitter":"1F465"},
      "shortcode": "busts_in_silhouette",
      "description": "BUSTS IN SILHOUETTE",
      "category": "people"
    },
    {
      "name": "speaking_head_in_silhouette",
      "unicode": {"apple":"1F5E3", "google":"1F5E3", "twitter":"1F5E3"},
      "shortcode": "speaking_head_in_silhouette",
      "description": " Speaking Head in Silhouette",
      "category": "people"
    },
    {
      "name": "baby",
      "unicode": {"apple":"1F476", "google":"1F476", "twitter":"1F476"},
      "shortcode": "baby",
      "description": "BABY",
      "category": "people"
    },
    {
      "name": "boy",
      "unicode": {"apple":"1F466", "google":"1F466", "twitter":"1F466"},
      "shortcode": "boy",
      "description": "BOY",
      "category": "people"
    },
    {
      "name": "girl",
      "unicode": {"apple":"1F467", "google":"1F467", "twitter":"1F467"},
      "shortcode": "girl",
      "description": "GIRL",
      "category": "people"
    },
    {
      "name": "man",
      "unicode": {"apple":"1F468", "google":"1F468", "twitter":"1F468"},
      "shortcode": "man",
      "description": "MAN",
      "category": "people"
    },
    {
      "name": "woman",
      "unicode": {"apple":"1F469", "google":"1F469", "twitter":"1F469"},
      "shortcode": "woman",
      "description": "WOMAN",
      "category": "people"
    },
    {
      "name": "person_with_blond_hair",
      "unicode": {"apple":"1F471", "google":"1F471", "twitter":"1F471"},
      "shortcode": "person_with_blond_hair",
      "description": "PERSON WITH BLOND HAIR",
      "category": "people"
    },
    {
      "name": "older_man",
      "unicode": {"apple":"1F474", "google":"1F474", "twitter":"1F474"},
      "shortcode": "older_man",
      "description": "OLDER MAN",
      "category": "people"
    },
    {
      "name": "older_woman",
      "unicode": {"apple":"1F475", "google":"1F475", "twitter":"1F475"},
      "shortcode": "older_woman",
      "description": "OLDER WOMAN",
      "category": "people"
    },
    {
      "name": "man_with_gua_pi_mao",
      "unicode": {"apple":"1F472", "google":"1F472", "twitter":"1F472"},
      "shortcode": "man_with_gua_pi_mao",
      "description": "MAN WITH GUA PI MAO",
      "category": "people"
    },
    {
      "name": "man_with_turban",
      "unicode": {"apple":"1F473", "google":"1F473", "twitter":"1F473"},
      "shortcode": "man_with_turban",
      "description": "MAN WITH TURBAN",
      "category": "people"
    },
    {
      "name": "cop",
      "unicode": {"apple":"1F46E", "google":"1F46E", "twitter":"1F46E"},
      "shortcode": "cop",
      "description": "POLICE OFFICER",
      "category": "people"
    },
    {
      "name": "construction_worker",
      "unicode": {"apple":"1F477", "google":"1F477", "twitter":"1F477"},
      "shortcode": "construction_worker",
      "description": "CONSTRUCTION WORKER",
      "category": "people"
    },
    {
      "name": "guardsman",
      "unicode": {"apple":"1F482", "google":"1F482", "twitter":"1F482"},
      "shortcode": "guardsman",
      "description": "GUARDSMAN",
      "category": "people"
    },
    {
      "name": "sleuth_or_spy",
      "unicode": {"apple":"1F575", "google":"1F575", "twitter":"1F575"},
      "shortcode": "sleuth_or_spy",
      "description": "Sleuth Or Spy",
      "category": "people"
    },
    {
      "name": "santa",
      "unicode": {"apple":"1F385", "google":"1F385", "twitter":"1F385"},
      "shortcode": "santa",
      "description": "FATHER CHRISTMAS",
      "category": "people"
    },
    {
      "name": "angel",
      "unicode": {"apple":"1F47C", "google":"1F47C", "twitter":"1F47C"},
      "shortcode": "angel",
      "description": "BABY ANGEL",
      "category": "people"
    },
    {
      "name": "princess",
      "unicode": {"apple":"1F478", "google":"1F478", "twitter":"1F478"},
      "shortcode": "princess",
      "description": "PRINCESS",
      "category": "people"
    },
    {
      "name": "bride_with_veil",
      "unicode": {"apple":"1F470", "google":"1F470", "twitter":"1F470"},
      "shortcode": "bride_with_veil",
      "description": "BRIDE WITH VEIL",
      "category": "people"
    },
    {
      "name": "walking",
      "unicode": {"apple":"1F6B6", "google":"1F6B6", "twitter":"1F6B6"},
      "shortcode": "walking",
      "description": "PEDESTRIAN",
      "category": "people"
    },
    {
      "name": "runner",
      "unicode": {"apple":"1F3C3", "google":"1F3C3", "twitter":"1F3C3"},
      "shortcode": "runner",
      "description": "RUNNER",
      "category": "people"
    },
    {
      "name": "dancer",
      "unicode": {"apple":"1F483", "google":"1F483", "twitter":"1F483"},
      "shortcode": "dancer",
      "description": "DANCER",
      "category": "people"
    },
    {
      "name": "dancers",
      "unicode": {"apple":"1F46F", "google":"1F46F", "twitter":"1F46F"},
      "shortcode": "dancers",
      "description": "WOMAN WITH BUNNY EARS",
      "category": "people"
    },
    {
      "name": "couple",
      "unicode": {"apple":"1F46B", "google":"1F46B", "twitter":"1F46B"},
      "shortcode": "couple",
      "description": "MAN AND WOMAN HOLDING HANDS",
      "category": "people"
    },
    {
      "name": "two_men_holding_hands",
      "unicode": {"apple":"1F46C", "google":"1F46C", "twitter":"1F46C"},
      "shortcode": "two_men_holding_hands",
      "description": "TWO MEN HOLDING HANDS",
      "category": "people"
    },
    {
      "name": "two_women_holding_hands",
      "unicode": {"apple":"1F46D", "google":"1F46D", "twitter":"1F46D"},
      "shortcode": "two_women_holding_hands",
      "description": "TWO WOMEN HOLDING HANDS",
      "category": "people"
    },
    {
      "name": "bow",
      "unicode": {"apple":"1F647", "google":"1F647", "twitter":"1F647"},
      "shortcode": "bow",
      "description": "PERSON BOWING DEEPLY",
      "category": "people"
    },
    {
      "name": "information_desk_person",
      "unicode": {"apple":"1F481", "google":"1F481", "twitter":"1F481"},
      "shortcode": "information_desk_person",
      "description": "INFORMATION DESK PERSON",
      "category": "people"
    },
    {
      "name": "no_good",
      "unicode": {"apple":"1F645", "google":"1F645", "twitter":"1F645"},
      "shortcode": "no_good",
      "description": "FACE WITH NO GOOD GESTURE",
      "category": "people"
    },
    {
      "name": "ok_woman",
      "unicode": {"apple":"1F646", "google":"1F646", "twitter":"1F646"},
      "shortcode": "ok_woman",
      "description": "FACE WITH OK GESTURE",
      "category": "people"
    },
    {
      "name": "raising_hand",
      "unicode": {"apple":"1F64B", "google":"1F64B", "twitter":"1F64B"},
      "shortcode": "raising_hand",
      "description": "HAPPY PERSON RAISING ONE HAND",
      "category": "people"
    },
    {
      "name": "person_with_pouting_face",
      "unicode": {"apple":"1F64E", "google":"1F64E", "twitter":"1F64E"},
      "shortcode": "person_with_pouting_face",
      "description": "PERSON WITH POUTING FACE",
      "category": "people"
    },
    {
      "name": "person_frowning",
      "unicode": {"apple":"1F64D", "google":"1F64D", "twitter":"1F64D"},
      "shortcode": "person_frowning",
      "description": "PERSON FROWNING",
      "category": "people"
    },
    {
      "name": "haircut",
      "unicode": {"apple":"1F487", "google":"1F487", "twitter":"1F487"},
      "shortcode": "haircut",
      "description": "HAIRCUT",
      "category": "people"
    },
    {
      "name": "massage",
      "unicode": {"apple":"1F486", "google":"1F486", "twitter":"1F486"},
      "shortcode": "massage",
      "description": "FACE MASSAGE",
      "category": "people"
    },
    {
      "name": "couple_with_heart",
      "unicode": {"apple":"1F491", "google":"1F491", "twitter":"1F491"},
      "shortcode": "couple_with_heart",
      "description": "COUPLE WITH HEART",
      "category": "people"
    },
    // {
    //   "name": "woman-heart-woman",
    //   "unicode": {"apple":"1F469-200D-2764-FE0F-200D-1F469", "google":"1F469-200D-2764-FE0F-200D-1F469", "twitter":"1F469-200D-2764-FE0F-200D-1F469"},
    //   "shortcode": "woman-heart-woman",
    //   "description": "Couple With Heart (Woman, Woman)",
    //   "category": "people"
    // },
    // {
    //   "name": "man-heart-man",
    //   "unicode": {"apple":"1F468-200D-2764-FE0F-200D-1F468", "google":"1F468-200D-2764-FE0F-200D-1F468", "twitter":"1F468-200D-2764-FE0F-200D-1F468"},
    //   "shortcode": "man-heart-man",
    //   "description": "COUPLE WITH HEART",
    //   "category": "people"
    // },
    {
      "name": "couplekiss",
      "unicode": {"apple":"1F48F", "google":"1F48F", "twitter":"1F48F"},
      "shortcode": "couplekiss",
      "description": "KISS",
      "category": "people"
    },
    // {
    //   "name": "woman-kiss-woman",
    //   "unicode": {"apple":"1F469-200D-2764-FE0F-200D-1F48B-200D-1F469", "google":"1F469-200D-2764-FE0F-200D-1F48B-200D-1F469", "twitter":"1F469-200D-2764-FE0F-200D-1F48B-200D-1F469"},
    //   "shortcode": "woman-kiss-woman",
    //   "description": "KISS",
    //   "category": "people"
    // },
    // {
    //   "name": "man-kiss-man",
    //   "unicode": {"apple":"1F468-200D-2764-FE0F-200D-1F48B-200D-1F468", "google":"1F468-200D-2764-FE0F-200D-1F48B-200D-1F468", "twitter":"1F468-200D-2764-FE0F-200D-1F48B-200D-1F468"},
    //   "shortcode": "man-kiss-man",
    //   "description": "KISS",
    //   "category": "people"
    // },
    {
      "name": "family",
      "unicode": {"apple":"1F46A", "google":"1F46A", "twitter":"1F46A"},
      "shortcode": "family",
      "description": "FAMILY",
      "category": "people"
    },
    // {
    //   "name": "man-woman-girl",
    //   "unicode": {"apple":"1F468-200D-1F469-200D-1F467", "google":"1F468-200D-1F469-200D-1F467", "twitter":"1F468-200D-1F469-200D-1F467"},
    //   "shortcode": "man-woman-girl",
    //   "description": "FAMILY",
    //   "category": "people"
    // },
    // {
    //   "name": "man-woman-girl-boy",
    //   "unicode": {"apple":"1F469-200D-1F469-200D-1F467-200D-1F466", "google":"1F469-200D-1F469-200D-1F467-200D-1F466", "twitter":"1F469-200D-1F469-200D-1F467-200D-1F466"},
    //   "shortcode": "man-woman-girl-boy",
    //   "description": "FAMILY",
    //   "category": "people"
    // },
    // {
    //   "name": "man-woman-boy-boy",
    //   "unicode": {"apple":"1F468-200D-1F469-200D-1F466-200D-1F466", "google":"1F468-200D-1F469-200D-1F466-200D-1F466", "twitter":"1F468-200D-1F469-200D-1F466-200D-1F466"},
    //   "shortcode": "man-woman-boy-boy",
    //   "description": "FAMILY",
    //   "category": "people"
    // },
    // {
    //   "name": "man-woman-girl-girl",
    //   "unicode": {"apple":"1F468-200D-1F469-200D-1F467-200D-1F467", "google":"1F468-200D-1F469-200D-1F467-200D-1F467", "twitter":"1F468-200D-1F469-200D-1F467-200D-1F467"},
    //   "shortcode": "man-woman-girl-girl",
    //   "description": "FAMILY",
    //   "category": "people"
    // },
    // {
    //   "name": "woman-woman-boy",
    //   "unicode": {"apple":"1F469-200D-1F469-200D-1F466", "google":"1F469-200D-1F469-200D-1F466", "twitter":"1F469-200D-1F469-200D-1F466"},
    //   "shortcode": "woman-woman-boy",
    //   "description": "FAMILY",
    //   "category": "people"
    // },
    // {
    //   "name": "woman-woman-girl",
    //   "unicode": {"apple":"1F469-200D-1F469-200D-1F467", "google":"1F469-200D-1F469-200D-1F467", "twitter":"1F469-200D-1F469-200D-1F467"},
    //   "shortcode": "woman-woman-girl",
    //   "description": "FAMILY",
    //   "category": "people"
    // },
    // {
    //   "name": "woman-woman-girl-boy",
    //   "unicode": {"apple":"1F469-200D-1F469-200D-1F467-200D-1F466", "google":"1F469-200D-1F469-200D-1F467-200D-1F466", "twitter":"1F469-200D-1F469-200D-1F467-200D-1F466"},
    //   "shortcode": "woman-woman-girl-boy",
    //   "description": "FAMILY",
    //   "category": "people"
    // },
    // {
    //   "name": "woman-woman-boy-boy",
    //   "unicode": {"apple":"1F469-200D-1F469-200D-1F466-200D-1F466", "google":"1F469-200D-1F469-200D-1F466-200D-1F466", "twitter":"1F469-200D-1F469-200D-1F466-200D-1F466"},
    //   "shortcode": "woman-woman-boy-boy",
    //   "description": "FAMILY",
    //   "category": "people"
    // },
    // {
    //   "name": "woman-woman-girl-girl",
    //   "unicode": {"apple":"1F469-200D-1F469-200D-1F467-200D-1F467", "google":"1F469-200D-1F469-200D-1F467-200D-1F467", "twitter":"1F469-200D-1F469-200D-1F467-200D-1F467"},
    //   "shortcode": "woman-woman-girl-girl",
    //   "description": "FAMILY",
    //   "category": "people"
    // },
    // {
    //   "name": "man-man-boy",
    //   "unicode": {"apple":"1F468-200D-1F468-200D-1F466", "google":"1F468-200D-1F468-200D-1F466", "twitter":"1F468-200D-1F468-200D-1F466"},
    //   "shortcode": "man-man-boy",
    //   "description": "FAMILY",
    //   "category": "people"
    // },
    // {
    //   "name": "man-man-girl",
    //   "unicode": {"apple":"1F468-200D-1F468-200D-1F467", "google":"1F468-200D-1F468-200D-1F467", "twitter":"1F468-200D-1F468-200D-1F467"},
    //   "shortcode": "man-man-girl",
    //   "description": "FAMILY",
    //   "category": "people"
    // },
    // {
    //   "name": "man-man-girl-boy",
    //   "unicode": {"apple":"1F468-200D-1F468-200D-1F467-200D-1F466", "google":"1F468-200D-1F468-200D-1F467-200D-1F466", "twitter":"1F468-200D-1F468-200D-1F467-200D-1F466"},
    //   "shortcode": "man-man-girl-boy",
    //   "description": "FAMILY",
    //   "category": "people"
    // },
    // {
    //   "name": "man-man-boy-boy",
    //   "unicode": {"apple":"1F468-200D-1F468-200D-1F466-200D-1F466", "google":"1F468-200D-1F468-200D-1F466-200D-1F466", "twitter":"1F468-200D-1F468-200D-1F466-200D-1F466"},
    //   "shortcode": "man-man-boy-boy",
    //   "description": "FAMILY",
    //   "category": "people"
    // },
    // {
    //   "name": "man-man-girl-girl",
    //   "unicode": {"apple":"1F468-200D-1F468-200D-1F467-200D-1F467", "google":"1F468-200D-1F468-200D-1F467-200D-1F467", "twitter":"1F468-200D-1F468-200D-1F467-200D-1F467"},
    //   "shortcode": "man-man-girl-girl",
    //   "description": "FAMILY",
    //   "category": "people"
    // },
    {
      "name": "womans_clothes",
      "unicode": {"apple":"1F45A", "google":"1F45A", "twitter":"1F45A"},
      "shortcode": "womans_clothes",
      "description": "WOMANS CLOTHES",
      "category": "people"
    },
    {
      "name": "shirt",
      "unicode": {"apple":"1F455", "google":"1F455", "twitter":"1F455"},
      "shortcode": "shirt",
      "description": "T-SHIRT",
      "category": "people"
    },
    {
      "name": "jeans",
      "unicode": {"apple":"1F456", "google":"1F456", "twitter":"1F456"},
      "shortcode": "jeans",
      "description": "JEANS",
      "category": "people"
    },
    {
      "name": "necktie",
      "unicode": {"apple":"1F454", "google":"1F454", "twitter":"1F454"},
      "shortcode": "necktie",
      "description": "NECKTIE",
      "category": "people"
    },
    {
      "name": "dress",
      "unicode": {"apple":"1F457", "google":"1F457", "twitter":"1F457"},
      "shortcode": "dress",
      "description": "DRESS",
      "category": "people"
    },
    {
      "name": "bikini",
      "unicode": {"apple":"1F459", "google":"1F459", "twitter":"1F459"},
      "shortcode": "bikini",
      "description": "BIKINI",
      "category": "people"
    },
    {
      "name": "kimono",
      "unicode": {"apple":"1F458", "google":"1F458", "twitter":"1F458"},
      "shortcode": "kimono",
      "description": "KIMONO",
      "category": "people"
    },
    {
      "name": "lipstick",
      "unicode": {"apple":"1F484", "google":"1F484", "twitter":"1F484"},
      "shortcode": "lipstick",
      "description": "LIPSTICK",
      "category": "people"
    },
    {
      "name": "kiss",
      "unicode": {"apple":"1F48B", "google":"1F48B", "twitter":"1F48B"},
      "shortcode": "kiss",
      "description": "KISS MARK",
      "category": "people"
    },
    {
      "name": "footprints",
      "unicode": {"apple":"1F463", "google":"1F463", "twitter":"1F463"},
      "shortcode": "footprints",
      "description": "FOOTPRINTS",
      "category": "people"
    },
    {
      "name": "high_heel",
      "unicode": {"apple":"1F460", "google":"1F460", "twitter":"1F460"},
      "shortcode": "high_heel",
      "description": "HIGH-HEELED SHOE",
      "category": "people"
    },
    {
      "name": "sandal",
      "unicode": {"apple":"1F461", "google":"1F461", "twitter":"1F461"},
      "shortcode": "sandal",
      "description": "WOMANS SANDAL",
      "category": "people"
    },
    {
      "name": "boot",
      "unicode": {"apple":"1F462", "google":"1F462", "twitter":"1F462"},
      "shortcode": "boot",
      "description": "WOMANS BOOTS",
      "category": "people"
    },
    {
      "name": "mans_shoe",
      "unicode": {"apple":"1F45E", "google":"1F45E", "twitter":"1F45E"},
      "shortcode": "mans_shoe",
      "description": "MANS SHOE",
      "category": "people"
    },
    {
      "name": "athletic_shoe",
      "unicode": {"apple":"1F45F", "google":"1F45F", "twitter":"1F45F"},
      "shortcode": "athletic_shoe",
      "description": "ATHLETIC SHOE",
      "category": "people"
    },
    {
      "name": "womans_hat",
      "unicode": {"apple":"1F452", "google":"1F452", "twitter":"1F452"},
      "shortcode": "womans_hat",
      "description": "WOMANS HAT",
      "category": "people"
    },
    {
      "name": "tophat",
      "unicode": {"apple":"1F3A9", "google":"1F3A9", "twitter":"1F3A9"},
      "shortcode": "tophat",
      "description": "TOP HAT",
      "category": "people"
    },
    {
      "name": "helmet_with_white_cross",
      "unicode": {"apple":"26D1", "google":"26D1", "twitter":"26D1"},
      "shortcode": "helmet_with_white_cross",
      "description": "Helmet With White Cross",
      "category": "people"
    },
    {
      "name": "mortar_board",
      "unicode": {"apple":"1F393", "google":"1F393", "twitter":"1F393"},
      "shortcode": "mortar_board",
      "description": "GRADUATION CAP",
      "category": "people"
    },
    {
      "name": "crown",
      "unicode": {"apple":"1F451", "google":"1F451", "twitter":"1F451"},
      "shortcode": "crown",
      "description": "CROWN",
      "category": "people"
    },
    {
      "name": "school_satchel",
      "unicode": {"apple":"1F392", "google":"1F392", "twitter":"1F392"},
      "shortcode": "school_satchel",
      "description": "SCHOOL SATCHEL",
      "category": "people"
    },
    {
      "name": "pouch",
      "unicode": {"apple":"1F45D", "google":"1F45D", "twitter":"1F45D"},
      "shortcode": "pouch",
      "description": "POUCH",
      "category": "people"
    },
    {
      "name": "purse",
      "unicode": {"apple":"1F45B", "google":"1F45B", "twitter":"1F45B"},
      "shortcode": "purse",
      "description": "PURSE",
      "category": "people"
    },
    {
      "name": "handbag",
      "unicode": {"apple":"1F45C", "google":"1F45C", "twitter":"1F45C"},
      "shortcode": "handbag",
      "description": "HANDBAG",
      "category": "people"
    },
    {
      "name": "briefcase",
      "unicode": {"apple":"1F4BC", "google":"1F4BC", "twitter":"1F4BC"},
      "shortcode": "briefcase",
      "description": "BRIEFCASE",
      "category": "people"
    },
    {
      "name": "eyeglasses",
      "unicode": {"apple":"1F453", "google":"1F453", "twitter":"1F453"},
      "shortcode": "eyeglasses",
      "description": "EYEGLASSES",
      "category": "people"
    },
    {
      "name": "dark_sunglasses",
      "unicode": {"apple":"1F576", "google":"1F576", "twitter":"1F576"},
      "shortcode": "dark_sunglasses",
      "description": "Dark Sunglasses",
      "category": "people"
    },
    {
      "name": "ring",
      "unicode": {"apple":"1F48D", "google":"1F48D", "twitter":"1F48D"},
      "shortcode": "ring",
      "description": "RING",
      "category": "people"
    },
    {
      "name": "closed_umbrella",
      "unicode": {"apple":"1F302", "google":"1F302", "twitter":"1F302"},
      "shortcode": "closed_umbrella",
      "description": "CLOSED UMBRELLA",
      "category": "people"
    },
  ]
})( jQuery );
