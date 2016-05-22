import api from '../api/core';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

function parseJSON(response) {
  return response.json();
}

const Handlers = {
  'fetchStatusForList': {
    init(params) {
      return {
        'type': 'FETCH_STATUS_FOR_LIST_INIT',
        params
      };
    },

    success(data, params) {
      return {
        'type': 'FETCH_STATUS_FOR_LIST_SUCCESS',
        data,
        params
      };
    },

    error(params) {
      return {
        'type': 'FETCH_STATUS_FOR_LIST_ERROR',
        params
      };
    }
  }
};


const Actions = {
  fetchStatusForList(params) {
    return (dispatch) => {
      return dispatch(Handlers.fetchStatusForList.success(response, params));
      return api.fetchStatusForList(params.listId)
        .then(checkStatus)
        .then(parseJSON)
        .then((json) => {
          dispatch(Handlers.fetchStatusForList.success(json, params));
        })
        .catch((error) => {
          console.log(error);
          const onComplete = function onComplete() {
            dispatch(Handlers.fetchStatusForList.error(params));
          };

          if (error && error.response && error.response.json) {
            error.response.json().then(onComplete);
          } else {
            onComplete();
          }
        });
    };
  }
};

const response = {
  "success": true,
  "data": [
    {
      "tweet_id": "734236140497051648",
      "tweet_author": "geekykaran",
      "tweet_author_name": "Karan Thakkar",
      "tweet_profile_image_url": "https://pbs.twimg.com/profile_images/728274649289785344/W1Ql2Zy__normal.jpg",
      "original_tweet_author": "femkesvs",
      "original_tweet_author_name": "Femke",
      "original_tweet_profile_image_url": "https://pbs.twimg.com/profile_images/699981442680549376/qGeF2MbG_normal.jpg",
      "original_tweet_id": "732205222374871040",
      "tweet_text": "Design is like an iceberg. You only see the 1 concept that made it\n\nThere's so much created underneath that never sees the light of the day",
      "tweet_url_entities": [],
      "tweet_media_entities": [],
      "tweet_type": "retweet",
      "retweet_count": 3,
      "favorite_count": 12,
      "tweet_posted_at": "Mon May 16 13:45:03 +0000 2016"
    },
    {
      "tweet_id": "734235525272338432",
      "tweet_author": "geekykaran",
      "tweet_author_name": "Karan Thakkar",
      "tweet_profile_image_url": "https://pbs.twimg.com/profile_images/728274649289785344/W1Ql2Zy__normal.jpg",
      "original_tweet_author": "ItsAustinSaylor",
      "original_tweet_author_name": "Austin Saylor ⛵️",
      "original_tweet_profile_image_url": "https://pbs.twimg.com/profile_images/712007761601695744/CgzrM912_normal.jpg",
      "original_tweet_id": "733009202248060928",
      "tweet_text": "If you start teaching what you know, you'll quickly realize you know more than you thought you did.",
      "tweet_url_entities": [],
      "tweet_media_entities": [],
      "tweet_type": "retweet",
      "retweet_count": 11,
      "favorite_count": 29,
      "tweet_posted_at": "Wed May 18 18:59:47 +0000 2016"
    },
    {
      "tweet_id": "734234698776346624",
      "tweet_author": "geekykaran",
      "tweet_author_name": "Karan Thakkar",
      "tweet_profile_image_url": "https://pbs.twimg.com/profile_images/728274649289785344/W1Ql2Zy__normal.jpg",
      "original_tweet_author": "bentossell",
      "original_tweet_author_name": "Ben Tossell",
      "original_tweet_profile_image_url": "https://pbs.twimg.com/profile_images/694847228171653120/feOVMsPj_normal.jpg",
      "original_tweet_id": "729971942934122496",
      "tweet_text": "Fuck your conversion funnel \n\nhttps://t.co/o0bnOsGOz7 h/t @meseali https://t.co/aTAuaS8k23",
      "tweet_url_entities": [
        {
          "url": "https://t.co/o0bnOsGOz7",
          "display_url": "medium.com/swlh/kill-your…",
          "expanded_url": "https://medium.com/swlh/kill-your-conversion-funnel-9367e461a46f#.ixktfavks",
          "indices": [
            30,
            53
          ]
        }
      ],
      "tweet_media_entities": [
        {
          "url": "https://t.co/aTAuaS8k23",
          "media_url": "https://pbs.twimg.com/media/CiFhjBkWMAAqWyf.jpg",
          "display_url": "pic.twitter.com/aTAuaS8k23",
          "expanded_url": "http://twitter.com/bentossell/status/729971942934122496/photo/1",
          "indices": [
            67,
            90
          ],
          "type": "photo",
          "aspectRatio": 1.1689453125
        }
      ],
      "tweet_type": "retweet",
      "retweet_count": 35,
      "favorite_count": 45,
      "tweet_posted_at": "Tue May 10 09:50:48 +0000 2016"
    },
    {
      "tweet_id": "733563565370527748",
      "tweet_author": "geekykaran",
      "tweet_author_name": "Karan Thakkar",
      "tweet_profile_image_url": "https://pbs.twimg.com/profile_images/728274649289785344/W1Ql2Zy__normal.jpg",
      "original_tweet_author": "geekykaran",
      "original_tweet_author_name": "Karan Thakkar",
      "original_tweet_profile_image_url": "https://pbs.twimg.com/profile_images/728274649289785344/W1Ql2Zy__normal.jpg",
      "original_tweet_id": "733563565370527748",
      "tweet_text": "Now contributions to Private Repositories can be included in contribution graph on @github - https://t.co/dWUjKP9vxT https://t.co/lUeMailLv4",
      "tweet_url_entities": [
        {
          "url": "https://t.co/dWUjKP9vxT",
          "display_url": "github.com/blog/2173-more…",
          "expanded_url": "https://github.com/blog/2173-more-contributions-on-your-profile",
          "indices": [
            93,
            116
          ]
        }
      ],
      "tweet_media_entities": [
        {
          "url": "https://t.co/lUeMailLv4",
          "media_url": "https://pbs.twimg.com/tweet_video_thumb/Ci4kDpGUoAAm8tg.jpg",
          "display_url": "pic.twitter.com/lUeMailLv4",
          "expanded_url": "http://twitter.com/geekykaran/status/733563565370527748/photo/1",
          "indices": [
            117,
            140
          ],
          "type": "photo",
          "aspectRatio": 0.5656108597285068
        }
      ],
      "tweet_type": "original",
      "retweet_count": 1,
      "favorite_count": 3,
      "tweet_posted_at": "Fri May 20 07:42:37 +0000 2016"
    },
    {
      "tweet_id": "733541268207230976",
      "tweet_author": "geekykaran",
      "tweet_author_name": "Karan Thakkar",
      "tweet_profile_image_url": "https://pbs.twimg.com/profile_images/728274649289785344/W1Ql2Zy__normal.jpg",
      "original_tweet_author": "DumbbellsnDrama",
      "original_tweet_author_name": "Protima Tiwary",
      "original_tweet_profile_image_url": "https://pbs.twimg.com/profile_images/731670355798953985/sAwbVDgC_normal.jpg",
      "original_tweet_id": "733211239690592260",
      "tweet_text": "#Food peeps in #Mumbai, Sunday ko fun is going to come. Please share your email ids with me no? I promise it's fun. \n\nPlease RT 🤘",
      "tweet_url_entities": [],
      "tweet_media_entities": [],
      "tweet_type": "retweet",
      "retweet_count": 24,
      "favorite_count": 9,
      "tweet_posted_at": "Thu May 19 08:22:36 +0000 2016"
    },
    {
      "tweet_id": "733528922206261248",
      "tweet_author": "geekykaran",
      "tweet_author_name": "Karan Thakkar",
      "tweet_profile_image_url": "https://pbs.twimg.com/profile_images/728274649289785344/W1Ql2Zy__normal.jpg",
      "original_tweet_author": "abheek",
      "original_tweet_author_name": "Abheek Anand",
      "original_tweet_profile_image_url": "https://pbs.twimg.com/profile_images/580373022780981248/St01g9e5_normal.jpg",
      "original_tweet_id": "733513928496406529",
      "tweet_text": "On asking the right questions. via https://t.co/uu3I6QdxUw https://t.co/dQQ3oVh6iG",
      "tweet_url_entities": [
        {
          "url": "https://t.co/uu3I6QdxUw",
          "display_url": "gatesnotes.com/Books/How-Not-…",
          "expanded_url": "https://www.gatesnotes.com/Books/How-Not-to-be-Wrong",
          "indices": [
            35,
            58
          ]
        }
      ],
      "tweet_media_entities": [
        {
          "url": "https://t.co/dQQ3oVh6iG",
          "media_url": "https://pbs.twimg.com/media/Ci32_ODUUAAwsj8.jpg",
          "display_url": "pic.twitter.com/dQQ3oVh6iG",
          "expanded_url": "http://twitter.com/abheek/status/733513928496406529/photo/1",
          "indices": [
            59,
            82
          ],
          "type": "photo",
          "aspectRatio": 1.3701171875
        }
      ],
      "tweet_type": "retweet",
      "retweet_count": 13,
      "favorite_count": 20,
      "tweet_posted_at": "Fri May 20 04:25:23 +0000 2016"
    },
    {
      "tweet_id": "733350150056206336",
      "tweet_author": "geekykaran",
      "tweet_author_name": "Karan Thakkar",
      "tweet_profile_image_url": "https://pbs.twimg.com/profile_images/728274649289785344/W1Ql2Zy__normal.jpg",
      "original_tweet_author": "williampietri",
      "original_tweet_author_name": "William Pietri",
      "original_tweet_profile_image_url": "https://pbs.twimg.com/profile_images/673948945962303489/5sxyC3Ey_normal.jpg",
      "original_tweet_id": "732602463082188801",
      "tweet_text": "Your company's most valuable resource is people giving a shit. Ask yourself: does your system encourage or discourage that?",
      "tweet_url_entities": [],
      "tweet_media_entities": [],
      "tweet_type": "retweet",
      "retweet_count": 877,
      "favorite_count": 813,
      "tweet_posted_at": "Tue May 17 16:03:32 +0000 2016"
    },
    {
      "tweet_id": "733304007557419013",
      "tweet_author": "geekykaran",
      "tweet_author_name": "Karan Thakkar",
      "tweet_profile_image_url": "https://pbs.twimg.com/profile_images/728274649289785344/W1Ql2Zy__normal.jpg",
      "original_tweet_author": "geekykaran",
      "original_tweet_author_name": "Karan Thakkar",
      "original_tweet_profile_image_url": "https://pbs.twimg.com/profile_images/728274649289785344/W1Ql2Zy__normal.jpg",
      "original_tweet_id": "733304007557419013",
      "tweet_text": "And that is why bots will never take over the world #YouHadOneJob https://t.co/Oiol9ZflI0",
      "tweet_url_entities": [],
      "tweet_media_entities": [
        {
          "url": "https://t.co/Oiol9ZflI0",
          "media_url": "https://pbs.twimg.com/media/Ci04GO1VEAAvIgb.jpg",
          "display_url": "pic.twitter.com/Oiol9ZflI0",
          "expanded_url": "http://twitter.com/geekykaran/status/733304007557419013/photo/1",
          "indices": [
            66,
            89
          ],
          "type": "photo",
          "aspectRatio": 1.7808695652173914
        }
      ],
      "tweet_type": "original",
      "retweet_count": 2,
      "favorite_count": 3,
      "tweet_posted_at": "Thu May 19 14:31:14 +0000 2016"
    },
    {
      "tweet_id": "733221168459603968",
      "tweet_author": "geekykaran",
      "tweet_author_name": "Karan Thakkar",
      "tweet_profile_image_url": "https://pbs.twimg.com/profile_images/728274649289785344/W1Ql2Zy__normal.jpg",
      "original_tweet_author": "geekykaran",
      "original_tweet_author_name": "Karan Thakkar",
      "original_tweet_profile_image_url": "https://pbs.twimg.com/profile_images/728274649289785344/W1Ql2Zy__normal.jpg",
      "original_tweet_id": "733221168459603968",
      "tweet_text": "Someone's getting fired at @myntra today. #MyntraDebacle",
      "tweet_url_entities": [],
      "tweet_media_entities": [],
      "tweet_type": "original",
      "retweet_count": 13,
      "favorite_count": 24,
      "tweet_posted_at": "Thu May 19 09:02:03 +0000 2016"
    },
    {
      "tweet_id": "733220091332939776",
      "tweet_author": "geekykaran",
      "tweet_author_name": "Karan Thakkar",
      "tweet_profile_image_url": "https://pbs.twimg.com/profile_images/728274649289785344/W1Ql2Zy__normal.jpg",
      "original_tweet_author": "geekykaran",
      "original_tweet_author_name": "Karan Thakkar",
      "original_tweet_profile_image_url": "https://pbs.twimg.com/profile_images/728274649289785344/W1Ql2Zy__normal.jpg",
      "original_tweet_id": "733220091332939776",
      "tweet_text": ".@myntra @MyntraSupport wtf are you doing, son? https://t.co/XKB90sVuOh",
      "tweet_url_entities": [],
      "tweet_media_entities": [
        {
          "url": "https://t.co/XKB90sVuOh",
          "media_url": "https://pbs.twimg.com/media/CizrxA0UoAAAjIi.jpg",
          "display_url": "pic.twitter.com/XKB90sVuOh",
          "expanded_url": "http://twitter.com/geekykaran/status/733220091332939776/photo/1",
          "indices": [
            48,
            71
          ],
          "type": "photo",
          "aspectRatio": 1.7786666666666666
        }
      ],
      "tweet_type": "original",
      "retweet_count": 1,
      "favorite_count": 4,
      "tweet_posted_at": "Thu May 19 08:57:47 +0000 2016"
    },
    {
      "tweet_id": "733196751960608768",
      "tweet_author": "geekykaran",
      "tweet_author_name": "Karan Thakkar",
      "tweet_profile_image_url": "https://pbs.twimg.com/profile_images/728274649289785344/W1Ql2Zy__normal.jpg",
      "original_tweet_author": "BenedictEvans",
      "original_tweet_author_name": "Benedict Evans",
      "original_tweet_profile_image_url": "https://pbs.twimg.com/profile_images/544407411193163776/vGSguvLd_normal.jpeg",
      "original_tweet_id": "733007089434427392",
      "tweet_text": "Someone at Google saw this cartoon and said 'yes! let's do that'. https://t.co/EQ4oewRJAD https://t.co/NfMada89vf",
      "tweet_url_entities": [
        {
          "url": "https://t.co/EQ4oewRJAD",
          "display_url": "xkcd.com/1367/",
          "expanded_url": "http://www.xkcd.com/1367/",
          "indices": [
            66,
            89
          ]
        }
      ],
      "tweet_media_entities": [
        {
          "url": "https://t.co/NfMada89vf",
          "media_url": "https://pbs.twimg.com/media/CiwqEFOVEAAhANF.jpg",
          "display_url": "pic.twitter.com/NfMada89vf",
          "expanded_url": "http://twitter.com/BenedictEvans/status/733007089434427392/photo/1",
          "indices": [
            90,
            113
          ],
          "type": "photo",
          "aspectRatio": 1.5458015267175573
        }
      ],
      "tweet_type": "retweet",
      "retweet_count": 525,
      "favorite_count": 480,
      "tweet_posted_at": "Wed May 18 18:51:23 +0000 2016"
    },
    {
      "tweet_id": "732416750298533888",
      "tweet_author": "geekykaran",
      "tweet_author_name": "Karan Thakkar",
      "tweet_profile_image_url": "https://pbs.twimg.com/profile_images/728274649289785344/W1Ql2Zy__normal.jpg",
      "original_tweet_author": "MKUMAR_33",
      "original_tweet_author_name": "Muthukumar A",
      "original_tweet_profile_image_url": "https://pbs.twimg.com/profile_images/678925874700267520/yQ6NnEi__normal.png",
      "original_tweet_id": "732407805420834816",
      "tweet_text": "https://t.co/XOUVhFdfWu",
      "tweet_url_entities": [],
      "tweet_media_entities": [
        {
          "url": "https://t.co/XOUVhFdfWu",
          "media_url": "https://pbs.twimg.com/media/CioJBAkUoAAUIfj.jpg",
          "display_url": "pic.twitter.com/XOUVhFdfWu",
          "expanded_url": "http://twitter.com/MKUMAR_33/status/732407805420834816/photo/1",
          "indices": [
            0,
            23
          ],
          "type": "photo",
          "aspectRatio": 0.12224938875305623
        }
      ],
      "tweet_type": "retweet",
      "retweet_count": 5,
      "favorite_count": 8,
      "tweet_posted_at": "Tue May 17 03:10:02 +0000 2016"
    },
    {
      "tweet_id": "732212372845264896",
      "tweet_author": "geekykaran",
      "tweet_author_name": "Karan Thakkar",
      "tweet_profile_image_url": "https://pbs.twimg.com/profile_images/728274649289785344/W1Ql2Zy__normal.jpg",
      "original_tweet_author": "snazzedout",
      "original_tweet_author_name": "Sristi Sinha",
      "original_tweet_profile_image_url": "https://pbs.twimg.com/profile_images/729638875191246848/qdpi7BqI_normal.jpg",
      "original_tweet_id": "726705762483994624",
      "tweet_text": "Call 09930463742 to\n#adopt these Spaniels: Mishka & Bruno. Owner is unwell & can no longer look after them #RT #Pune https://t.co/QXJUMTmQqr",
      "tweet_url_entities": [],
      "tweet_media_entities": [
        {
          "url": "https://t.co/QXJUMTmQqr",
          "media_url": "https://pbs.twimg.com/media/ChXHBDBWUAE1ren.jpg",
          "display_url": "pic.twitter.com/QXJUMTmQqr",
          "expanded_url": "http://twitter.com/snazzedout/status/726705762483994624/photo/1",
          "indices": [
            125,
            148
          ],
          "type": "photo",
          "aspectRatio": 1
        }
      ],
      "tweet_type": "retweet",
      "retweet_count": 28,
      "favorite_count": 9,
      "tweet_posted_at": "Sun May 01 09:32:09 +0000 2016"
    },
    {
      "tweet_id": "732203120080633856",
      "tweet_author": "geekykaran",
      "tweet_author_name": "Karan Thakkar",
      "tweet_profile_image_url": "https://pbs.twimg.com/profile_images/728274649289785344/W1Ql2Zy__normal.jpg",
      "original_tweet_author": "rrhoover",
      "original_tweet_author_name": "Ryan Hoover",
      "original_tweet_profile_image_url": "https://pbs.twimg.com/profile_images/554515151575994369/MiDNqbJa_normal.jpeg",
      "original_tweet_id": "732202232658206720",
      "tweet_text": "Read Medium w/o your boss or teacher knowing 😁\n\nA command line Interface for Medium: https://t.co/V0vmHW9od4 https://t.co/uXeHIiuti0",
      "tweet_url_entities": [
        {
          "url": "https://t.co/V0vmHW9od4",
          "display_url": "producthunt.com/tech/medium-cli",
          "expanded_url": "https://www.producthunt.com/tech/medium-cli",
          "indices": [
            85,
            108
          ]
        }
      ],
      "tweet_media_entities": [
        {
          "url": "https://t.co/uXeHIiuti0",
          "media_url": "https://pbs.twimg.com/media/CilODQeWgAEDLSA.jpg",
          "display_url": "pic.twitter.com/uXeHIiuti0",
          "expanded_url": "http://twitter.com/rrhoover/status/732202232658206720/photo/1",
          "indices": [
            109,
            132
          ],
          "type": "photo",
          "aspectRatio": 0.49767441860465117
        }
      ],
      "tweet_type": "retweet",
      "retweet_count": 18,
      "favorite_count": 56,
      "tweet_posted_at": "Mon May 16 13:33:10 +0000 2016"
    },
    {
      "tweet_id": "732198883028291584",
      "tweet_author": "geekykaran",
      "tweet_author_name": "Karan Thakkar",
      "tweet_profile_image_url": "https://pbs.twimg.com/profile_images/728274649289785344/W1Ql2Zy__normal.jpg",
      "original_tweet_author": "PotterWorldUK",
      "original_tweet_author_name": "Harry Potter World",
      "original_tweet_profile_image_url": "https://pbs.twimg.com/profile_images/378800000581029910/7d73c2615918d93013cb709895f6ab98_normal.jpeg",
      "original_tweet_id": "732193142166839296",
      "tweet_text": "Neville didn't really escape... https://t.co/Dti1qYg9oR",
      "tweet_url_entities": [],
      "tweet_media_entities": [
        {
          "url": "https://t.co/Dti1qYg9oR",
          "media_url": "https://pbs.twimg.com/media/CikOD_1UkAApY33.jpg",
          "display_url": "pic.twitter.com/Dti1qYg9oR",
          "expanded_url": "http://twitter.com/PotterWorldUK/status/732193142166839296/photo/1",
          "indices": [
            32,
            55
          ],
          "type": "photo",
          "aspectRatio": 1
        }
      ],
      "tweet_type": "retweet",
      "retweet_count": 943,
      "favorite_count": 1671,
      "tweet_posted_at": "Mon May 16 12:57:03 +0000 2016"
    },
    {
      "tweet_id": "732116070555754496",
      "tweet_author": "geekykaran",
      "tweet_author_name": "Karan Thakkar",
      "tweet_profile_image_url": "https://pbs.twimg.com/profile_images/728274649289785344/W1Ql2Zy__normal.jpg",
      "original_tweet_author": "kunalb11",
      "original_tweet_author_name": "Kunal Shah",
      "original_tweet_profile_image_url": "https://pbs.twimg.com/profile_images/641884936123711488/9SHCO5wz_normal.jpg",
      "original_tweet_id": "729608763359952896",
      "tweet_text": "How to be popular?\n\nHard way: build a $100M+ company \n\nEasy way: write crap about them",
      "tweet_url_entities": [],
      "tweet_media_entities": [],
      "tweet_type": "retweet",
      "retweet_count": 82,
      "favorite_count": 108,
      "tweet_posted_at": "Mon May 09 09:47:39 +0000 2016"
    },
    {
      "tweet_id": "732099634093527040",
      "tweet_author": "geekykaran",
      "tweet_author_name": "Karan Thakkar",
      "tweet_profile_image_url": "https://pbs.twimg.com/profile_images/728274649289785344/W1Ql2Zy__normal.jpg",
      "original_tweet_author": "geekykaran",
      "original_tweet_author_name": "Karan Thakkar",
      "original_tweet_profile_image_url": "https://pbs.twimg.com/profile_images/728274649289785344/W1Ql2Zy__normal.jpg",
      "original_tweet_id": "732099634093527040",
      "tweet_text": "“I’ve Got a Deal for Donald Trump”  — @davepell https://t.co/DLfogAUx7T https://t.co/1vEzoBAF8e",
      "tweet_url_entities": [
        {
          "url": "https://t.co/DLfogAUx7T",
          "display_url": "medium.com/@davepell/ive-…",
          "expanded_url": "https://medium.com/@davepell/ive-got-a-deal-for-donald-trump-2269666022cf",
          "indices": [
            48,
            71
          ]
        }
      ],
      "tweet_media_entities": [
        {
          "url": "https://t.co/1vEzoBAF8e",
          "media_url": "https://pbs.twimg.com/media/CijwvMRWgAEHQT1.jpg",
          "display_url": "pic.twitter.com/1vEzoBAF8e",
          "expanded_url": "http://twitter.com/geekykaran/status/732099634093527040/photo/1",
          "indices": [
            72,
            95
          ],
          "type": "photo",
          "aspectRatio": 0.6226666666666667
        }
      ],
      "tweet_type": "original",
      "retweet_count": 2,
      "favorite_count": 3,
      "tweet_posted_at": "Mon May 16 06:45:29 +0000 2016"
    },
    {
      "tweet_id": "732079902644523008",
      "tweet_author": "geekykaran",
      "tweet_author_name": "Karan Thakkar",
      "tweet_profile_image_url": "https://pbs.twimg.com/profile_images/728274649289785344/W1Ql2Zy__normal.jpg",
      "original_tweet_author": "levie",
      "original_tweet_author_name": "Aaron Levie",
      "original_tweet_profile_image_url": "https://pbs.twimg.com/profile_images/1626898956/twitter_normal.png",
      "original_tweet_id": "727708477955690496",
      "tweet_text": "\"President Trump\" is now trending. My only advice at this point is to encrypt everything and buy a Tesla with Bioweapon Defense Mode.",
      "tweet_url_entities": [],
      "tweet_media_entities": [],
      "tweet_type": "retweet",
      "retweet_count": 663,
      "favorite_count": 1263,
      "tweet_posted_at": "Wed May 04 03:56:35 +0000 2016"
    },
    {
      "tweet_id": "731752453222338560",
      "tweet_author": "geekykaran",
      "tweet_author_name": "Karan Thakkar",
      "tweet_profile_image_url": "https://pbs.twimg.com/profile_images/728274649289785344/W1Ql2Zy__normal.jpg",
      "original_tweet_author": "ITNlive",
      "original_tweet_author_name": "INDIA TRENDING NOW",
      "original_tweet_profile_image_url": "https://pbs.twimg.com/profile_images/727736895573262338/twbqWqQh_normal.jpg",
      "original_tweet_id": "731682448124174336",
      "tweet_text": "#MustRead \nA 10-year-old Indian girl sent $20 to the RBI to help the economy. \nHere is what #RaghuramRajan  replied https://t.co/Tkpuq9ZkHA",
      "tweet_url_entities": [],
      "tweet_media_entities": [
        {
          "url": "https://t.co/Tkpuq9ZkHA",
          "media_url": "https://pbs.twimg.com/media/Cid1TGlUoAAvW6G.jpg",
          "display_url": "pic.twitter.com/Tkpuq9ZkHA",
          "expanded_url": "http://twitter.com/ITNlive/status/731682448124174336/photo/1",
          "indices": [
            116,
            139
          ],
          "type": "photo",
          "aspectRatio": 1.3362068965517242
        }
      ],
      "tweet_type": "retweet",
      "retweet_count": 1254,
      "favorite_count": 1192,
      "tweet_posted_at": "Sun May 15 03:07:44 +0000 2016"
    },
    {
      "tweet_id": "731746695608999936",
      "tweet_author": "geekykaran",
      "tweet_author_name": "Karan Thakkar",
      "tweet_profile_image_url": "https://pbs.twimg.com/profile_images/728274649289785344/W1Ql2Zy__normal.jpg",
      "original_tweet_author": "tzhongg",
      "original_tweet_author_name": "Tiffany Zhong",
      "original_tweet_profile_image_url": "https://pbs.twimg.com/profile_images/730848031981985792/OP03KY9i_normal.jpg",
      "original_tweet_id": "615336974044434432",
      "tweet_text": "Your app/product should keep people coming back even if push notifications are off. That's when you know you have a real winner.",
      "tweet_url_entities": [],
      "tweet_media_entities": [],
      "tweet_type": "retweet",
      "retweet_count": 279,
      "favorite_count": 592,
      "tweet_posted_at": "Mon Jun 29 01:52:21 +0000 2015"
    },
    {
      "tweet_id": "731745990445793280",
      "tweet_author": "geekykaran",
      "tweet_author_name": "Karan Thakkar",
      "tweet_profile_image_url": "https://pbs.twimg.com/profile_images/728274649289785344/W1Ql2Zy__normal.jpg",
      "original_tweet_author": "sama",
      "original_tweet_author_name": "Sam Altman",
      "original_tweet_profile_image_url": "https://pbs.twimg.com/profile_images/1272740548/SamAltman_new_cropped_small_normal.jpg",
      "original_tweet_id": "730461108830539776",
      "tweet_text": "\"Almost all great people are more motivated by wanting respect from people they respect than by money. I'd never have believed this at 20.\"",
      "tweet_url_entities": [],
      "tweet_media_entities": [],
      "tweet_type": "retweet",
      "retweet_count": 297,
      "favorite_count": 505,
      "tweet_posted_at": "Wed May 11 18:14:34 +0000 2016"
    },
    {
      "tweet_id": "731499292033220608",
      "tweet_author": "geekykaran",
      "tweet_author_name": "Karan Thakkar",
      "tweet_profile_image_url": "https://pbs.twimg.com/profile_images/728274649289785344/W1Ql2Zy__normal.jpg",
      "original_tweet_author": "geekykaran",
      "original_tweet_author_name": "Karan Thakkar",
      "original_tweet_profile_image_url": "https://pbs.twimg.com/profile_images/728274649289785344/W1Ql2Zy__normal.jpg",
      "original_tweet_id": "731499292033220608",
      "tweet_text": "I'm at Aromas Café in Mumbai, Maharashtra w/ @narendra_shetty https://t.co/DAIlmq96gr",
      "tweet_url_entities": [
        {
          "url": "https://t.co/DAIlmq96gr",
          "display_url": "swarmapp.com/c/0mYog3fovak",
          "expanded_url": "https://www.swarmapp.com/c/0mYog3fovak",
          "indices": [
            62,
            85
          ]
        }
      ],
      "tweet_media_entities": [],
      "tweet_type": "original",
      "retweet_count": 0,
      "favorite_count": 0,
      "tweet_posted_at": "Sat May 14 14:59:56 +0000 2016"
    },
    {
      "tweet_id": "731397572510781440",
      "tweet_author": "geekykaran",
      "tweet_author_name": "Karan Thakkar",
      "tweet_profile_image_url": "https://pbs.twimg.com/profile_images/728274649289785344/W1Ql2Zy__normal.jpg",
      "original_tweet_author": "GoodshowsApp",
      "original_tweet_author_name": "Goodshows",
      "original_tweet_profile_image_url": "https://pbs.twimg.com/profile_images/692597924660797441/T9IyORu__normal.png",
      "original_tweet_id": "731369627368841216",
      "tweet_text": "Kit Harington Says He Only Told One Stranger About Jon Snow's Fate. 😀 #GameofThrones https://t.co/YKg6SMkMNV",
      "tweet_url_entities": [],
      "tweet_media_entities": [
        {
          "url": "https://t.co/YKg6SMkMNV",
          "media_url": "https://pbs.twimg.com/media/CiZYyfYUYAEVGOX.jpg",
          "display_url": "pic.twitter.com/YKg6SMkMNV",
          "expanded_url": "http://twitter.com/GoodshowsApp/status/731369627368841216/photo/1",
          "indices": [
            85,
            108
          ],
          "type": "photo",
          "aspectRatio": 1.512962962962963
        }
      ],
      "tweet_type": "retweet",
      "retweet_count": 421,
      "favorite_count": 280,
      "tweet_posted_at": "Sat May 14 06:24:42 +0000 2016"
    },
    {
      "tweet_id": "731376064727912453",
      "tweet_author": "geekykaran",
      "tweet_author_name": "Karan Thakkar",
      "tweet_profile_image_url": "https://pbs.twimg.com/profile_images/728274649289785344/W1Ql2Zy__normal.jpg",
      "original_tweet_author": "r0unak",
      "original_tweet_author_name": "Rounak Jain",
      "original_tweet_profile_image_url": "https://pbs.twimg.com/profile_images/453993106245816320/miDLiKdq_normal.jpeg",
      "original_tweet_id": "725223378064314369",
      "tweet_text": "client expectation vs budget https://t.co/J6szIH8Vp5",
      "tweet_url_entities": [],
      "tweet_media_entities": [
        {
          "url": "https://t.co/J6szIH8Vp5",
          "media_url": "https://pbs.twimg.com/media/ChCC0bCUgAAvW9V.jpg",
          "display_url": "pic.twitter.com/J6szIH8Vp5",
          "expanded_url": "http://twitter.com/r0unak/status/725223378064314369/photo/1",
          "indices": [
            29,
            52
          ],
          "type": "photo",
          "aspectRatio": 0.671875
        }
      ],
      "tweet_type": "retweet",
      "retweet_count": 1027,
      "favorite_count": 848,
      "tweet_posted_at": "Wed Apr 27 07:21:41 +0000 2016"
    },
    {
      "tweet_id": "731325864961511425",
      "tweet_author": "geekykaran",
      "tweet_author_name": "Karan Thakkar",
      "tweet_profile_image_url": "https://pbs.twimg.com/profile_images/728274649289785344/W1Ql2Zy__normal.jpg",
      "original_tweet_author": "GoodshowsApp",
      "original_tweet_author_name": "Goodshows",
      "original_tweet_profile_image_url": "https://pbs.twimg.com/profile_images/692597924660797441/T9IyORu__normal.png",
      "original_tweet_id": "731201449762267137",
      "tweet_text": "Dear @netflix, \nSave Agent Carter, bring her to NETFLIX 🙏  cc:@louisde2\nhttps://t.co/M3PUqU0VNs",
      "tweet_url_entities": [
        {
          "url": "https://t.co/M3PUqU0VNs",
          "display_url": "change.org/p/netflix-save…",
          "expanded_url": "https://www.change.org/p/netflix-save-agent-carter-bring-her-to-netflix",
          "indices": [
            72,
            95
          ]
        }
      ],
      "tweet_media_entities": [],
      "tweet_type": "retweet",
      "retweet_count": 9,
      "favorite_count": 20,
      "tweet_posted_at": "Fri May 13 19:16:25 +0000 2016"
    },
    {
      "tweet_id": "731322826456760320",
      "tweet_author": "geekykaran",
      "tweet_author_name": "Karan Thakkar",
      "tweet_profile_image_url": "https://pbs.twimg.com/profile_images/728274649289785344/W1Ql2Zy__normal.jpg",
      "original_tweet_author": "ValaAfshar",
      "original_tweet_author_name": "Vala Afshar",
      "original_tweet_profile_image_url": "https://pbs.twimg.com/profile_images/1259558245/vala_300dpi_normal.jpg",
      "original_tweet_id": "731181155194654722",
      "tweet_text": "Easy work:\n1 complaining\n2 pretending\n3 blaming\n4 judging\n5 resenting\n\nHard work:\n1 inspiring\n2 teaching\n3 learning\n4 giving\n5 empowering",
      "tweet_url_entities": [],
      "tweet_media_entities": [],
      "tweet_type": "retweet",
      "retweet_count": 74,
      "favorite_count": 70,
      "tweet_posted_at": "Fri May 13 17:55:46 +0000 2016"
    }
  ],
  "next_max_id": "731322826456760319"
};

export default Actions;
