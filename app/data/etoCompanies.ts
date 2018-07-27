import { IEtoOfferingProps } from "../components/shared/EtoOfferingCard";

import * as blockstatehover from "../assets/img/eto_offers/blockstate-hover@1x.png";
import * as blockstate2hover from "../assets/img/eto_offers/blockstate-hover@2x.png";
import * as blockstate from "../assets/img/eto_offers/blockstate@1x.jpg";
import * as blockstate2 from "../assets/img/eto_offers/blockstate@2x.jpg";
import * as brile24hover from "../assets/img/eto_offers/brille_animation.gif";
import * as brile24 from "../assets/img/eto_offers/brille_card.jpg";
import * as emflux from "../assets/img/eto_offers/emflux.jpg";
import * as emfluxhover from "../assets/img/eto_offers/emfluxhover@1x.jpg";
import * as emflux2hover from "../assets/img/eto_offers/emfluxhover@2x.jpg";
import * as foundersbank from "../assets/img/eto_offers/foundersbank.png";
import * as foundersbank2 from "../assets/img/eto_offers/foundersbank@2x.png";
import * as foundersbankhover2 from "../assets/img/eto_offers/Foundersbankhover.png";
import * as foundersbankhover from "../assets/img/eto_offers/Foundersbankhover@1x.png";
import * as foundersbankhover3 from "../assets/img/eto_offers/Foundersbankhover@3x.png";
import * as myswoop from "../assets/img/eto_offers/myswoop.jpg";
import * as myswoop2 from "../assets/img/eto_offers/myswoop@2x.jpg";
import * as myswoopbadge from "../assets/img/eto_offers/myswoopbadge@1x.jpg";
import * as myswoopbadge2 from "../assets/img/eto_offers/myswoopbadge@2x.jpg";
import * as myswoophover from "../assets/img/eto_offers/myswoophover@1x.jpg";
import * as myswoop2hover from "../assets/img/eto_offers/myswoophover@2x.jpg";
import * as nextbigthing from "../assets/img/eto_offers/nextbigthing.jpg";
import * as nextbigthing2 from "../assets/img/eto_offers/nextbigthing@2x.jpg";
import * as nextbigthinghover from "../assets/img/eto_offers/nextbigthinghover@1x.jpg";
import * as nextbigthing2hover from "../assets/img/eto_offers/nextbigthinghover@2x.jpg";
import * as unitihover from "../assets/img/eto_offers/uniti.gif";
import * as uniti from "../assets/img/eto_offers/uniti@1x.jpg";
import * as uniti2 from "../assets/img/eto_offers/uniti@2x.jpg";

export type EtoData = { data: IEtoOfferingProps };

export const etoCompaniesCards: Array<EtoData> = [
  {
    data: {
      roundName: "series d",
      tags: [
        {
          text: "eyetech",
          layout: "ghost-bold",
          theme: "white",
        },
        {
          text: "germany",
          layout: "ghost-bold",
          theme: "white",
        },
      ],
      name: "BRILLE24",
      description:
        "Eyewear pioneer aiming to change the way people access eye care with smart AI-applications. Founded 10 years ago, Brille24 has sold more than 2 million glasses and is currently serving millions of customers.",
      quote: {
        text: "",
        credits: "",
      },
      topImage: {
        srcSet: {
          "1x": brile24,
        },
        alt: "",
        height: 50,
        width: 100,
      },
      quoteImage: {
        srcSet: {
          "1x": brile24hover,
        },
        alt: "",
        height: 270,
        width: 530,
      },
      to: "https://itunes.apple.com/de/app/brille24/id1262362205?l=en&mt=8",
      bannerWithGif: true,
    },
  },
  {
    data: {
      roundName: "seed",
      tags: [
        {
          text: "automotive",
          layout: "ghost-bold",
          theme: "white",
        },
        {
          text: "sweden",
          layout: "ghost-bold",
          theme: "white",
        },
      ],
      name: "UNITI",
      description:
        "Uniti is the Swedish electric car startup offering what CNBC has called “the car of the future.” Safe & affordable EVs with premium technology and a progressive design — it’s what we do.",
      quote: {
        text: "",
        credits: "",
      },
      topImage: {
        srcSet: {
          "1x": uniti,
          "2x": uniti2,
        },
        alt: "",
        height: 50,
        width: 100,
      },
      quoteImage: {
        srcSet: {
          "1x": unitihover,
        },
        alt: "",
        height: 261,
        width: 525,
      },
      bannerWithGif: true,
      to: "https://www.youtube.com/watch?v=49JASBTng-4",
    },
  },
  {
    data: {
      roundName: "series b",
      tags: [
        {
          text: "re-commerce",
          layout: "ghost-bold",
          theme: "white",
        },
        {
          text: "germany",
          layout: "ghost-bold",
          theme: "white",
        },
      ],
      name: "mySWOOOP",
      description:
        "Omni-Channel re-commerce platform buying and selling new and used electronics. With tailored software technology, mySWOOOP automatically determines current market prices in real-time assuring attractive resale-margins.",
      quote: {
        text:
          "mySWOOOP performing an innovative trading approach is a key role in our digital agenda. We’re impressed by an average annual sales growth of more than 170% that generated net sales of 4.6 Million in 2017 and we’re looking forward to support growth strategy in 2018.",
        credits: "Rainer Wohlers, Melchers Group",
      },
      topImage: {
        srcSet: {
          "1x": myswoop,
          "2x": myswoop2,
        },
        alt: "",
        height: 50,
        width: 100,
      },
      quoteImage: {
        srcSet: {
          "1x": myswoophover,
          "2x": myswoop2hover,
        },
        alt: "",
        height: 35,
        width: 100,
      },
      badge: {
        srcSet: {
          "1x": myswoopbadge,
          "2x": myswoopbadge2,
        },
        alt: "",
        height: 81,
        width: 71,
      },
      to: "http://www.myswooop.de/",
    },
  },
  {
    data: {
      roundName: "series a",
      tags: [
        {
          text: "iot",
          layout: "ghost-bold",
          theme: "white",
        },
        {
          text: "germany",
          layout: "ghost-bold",
          theme: "white",
        },
      ],
      name: "NEXT BIG THING",
      description:
        "As Europe’s premier startup incubator for IoT & blockchain and Germany’s chosen Digital Hub for IoT, NBT drives European innovation. NBT leverages its technological and economic ecosystem to enable disruptive business models.",
      quote: {
        text:
          "As IoT will significantly change service and industry structures, NBT offers early participation in this disruptive opportunity. They convinced me with their clear focus, proven track record, and professional attitude. The concept and structure are purposefully goal-oriented.",
        credits: "Rudi Ludwig, Investor",
      },
      topImage: {
        srcSet: {
          "1x": nextbigthing,
          "2x": nextbigthing2,
        },
        alt: "",
        height: 50,
        width: 100,
      },
      quoteImage: {
        srcSet: {
          "1x": nextbigthinghover,
          "2x": nextbigthing2hover,
        },
        alt: "",
        height: 50,
        width: 100,
      },
      to: "http://www.nextbigthing.ag/",
    },
  },
  {
    data: {
      roundName: "series a",
      tags: [
        {
          text: "mobility",
          layout: "ghost-bold",
          theme: "white",
        },
        {
          text: "india",
          layout: "ghost-bold",
          theme: "white",
        },
      ],
      name: "EMFLUX MOTORS",
      description:
        "Electric superbike changing the landscape of transportation & mobility. India-based venture backed by both crypto and traditional investors with a mission to power 10 million electric bikes in India by 2027.",
      quote: {
        text:
          "The Emflux ETO is a great opportunity to finance a game changing team in the Indian electric vehicles space. The company is deploying the Tesla model of moving from high end to mass market vehicles in the humungous Indian two wheeler segment.",
        credits: "Meher Roy, co-founder of Chorus One and host at Epicenter.tv",
      },
      topImage: {
        srcSet: {
          "1x": emflux,
        },
        alt: "",
        height: 50,
        width: 100,
      },
      quoteImage: {
        srcSet: {
          "1x": emfluxhover,
          "2x": emflux2hover,
        },
        alt: "",
        height: 35,
        width: 100,
      },
      to: "http://www.emfluxmotors.com/",
    },
  },
  {
    data: {
      roundName: "seed",
      tags: [
        {
          text: "fintech",
          layout: "ghost-bold",
          theme: "white",
        },
        {
          text: "germany",
          layout: "ghost-bold",
          theme: "white",
        },
      ],
      name: "BLOCKSTATE",
      description:
        "Creating products for the future of finance. BlockState builds efficient, transparent and compliant products for Asset Management, Debt Issuance and Derivatives based on Blockchain technology.",
      quote: {
        text: "",
        credits: "",
      },
      topImage: {
        srcSet: {
          "1x": blockstate,
          "2x": blockstate2,
        },
        alt: "",
        height: 50,
        width: 100,
      },
      quoteImage: {
        srcSet: {
          "1x": blockstatehover,
          "2x": blockstate2hover,
        },
        alt: "",
        height: 35,
        width: 100,
      },
      to: "http://www.blockstate.com",
    },
  },
  {
    data: {
      tags: [
        {
          text: "community",
          layout: "ghost-bold",
          theme: "white",
        },
        {
          text: "banking",
          layout: "ghost-bold",
          theme: "white",
        },
        {
          text: "crypto",
          layout: "ghost-bold",
          theme: "white",
        },
      ],
      description:
        "Founders focused bank empowering tech and crypto. Progressive banking solutions for investors and inventors.",
      topImage: {
        src: "",
        srcSet: {
          "1x": "",
        },
        alt: "",
        height: 50,
        width: 100,
      },
      quoteImage: {
        src: "",
        srcSet: {
          "1x": "",
        },
        alt: "",
        height: 35,
        width: 100,
      },
      teaser: true,
    },
  },
  {
    data: {
      tags: [
        {
          text: "biotech",
          layout: "ghost-bold",
          theme: "white",
        },
      ],
      description:
        "German biotech startup introducing precision prevention with DNA healthcare applications. Featuring genome sequencing technologies.",
      topImage: {
        src: "",
        srcSet: {
          "1x": "",
        },
        alt: "",
        height: 50,
        width: 100,
      },
      quoteImage: {
        src: "",
        srcSet: {
          "1x": "",
        },
        alt: "",
        height: 35,
        width: 100,
      },
      teaser: true,
    },
  },
  {
    data: {
      tags: [
        {
          text: "blockchain",
          layout: "ghost-bold",
          theme: "white",
        },
      ],
      description:
        "Fintech developing solutions for transacting fiat currencies over blockchains – Smart Money. Coming to Ethereum in 2018.",
      topImage: {
        src: "",
        srcSet: {
          "1x": "",
        },
        alt: "",
        height: 50,
        width: 100,
      },
      quoteImage: {
        src: "",
        srcSet: {
          "1x": "",
        },
        alt: "",
        height: 50,
        width: 100,
      },
      teaser: true,
    },
  },
  {
    data: {
      tags: [
        {
          text: "energy",
          layout: "ghost-bold",
          theme: "white",
        },
      ],
      description:
        "Creating renewable energy solutions for a clean and sustainable world. Algorithm-based technology utilizing waste.",
      quote: {
        text:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus, voluptatum illum unde doloremque sequi cum sed ex odit. Ad deleniti veniam, aliquid dolor eaque libero nobis magnam repellendus sed laborum.",
        credits: "John",
      },
      topImage: {
        src: "",
        srcSet: {
          "1x": "",
        },
        alt: "",
        height: 50,
        width: 100,
      },
      quoteImage: {
        src: "",
        srcSet: {
          "1x": "",
        },
        alt: "",
        height: 35,
        width: 100,
      },
      teaser: true,
    },
  },
];

if (process.env.NF_FOUNDERS_BANK_VISIBLE) {
  etoCompaniesCards[6] = {
    data: {
      tags: [
        {
          text: "community",
          layout: "ghost-bold",
          theme: "white",
        },
        {
          text: "banking",
          layout: "ghost-bold",
          theme: "white",
        },
        {
          text: "crypto",
          layout: "ghost-bold",
          theme: "white",
        },
      ],
      name: "Founders Bank",
      description:
        "Once licensed, Founders Bank will bridge the gap between the traditional world of finance and innovative crypto companies, delivering high tech banking solutions. Focused on and owned by founders.",
      topImage: {
        src: foundersbank,
        srcSet: {
          "1x": foundersbank,
          "2x": foundersbank2,
        },
        alt: "",
        height: 50,
        width: 100,
      },
      quoteImage: {
        src: "",
        srcSet: {
          "1x": foundersbankhover,
          "2x": foundersbankhover2,
          "3x": foundersbankhover3,
        },
        alt: "Founders bank",
        height: 35,
        width: 100,
      },
      to: "https://www.foundersbank.org",
    },
  };
}
