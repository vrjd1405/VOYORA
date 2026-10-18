export interface CuratedDish {
  dish: string;
  description: string;
  bestTime: string;
  recommendedPlaces: string[];
}

export const CURATED_DINING_DATABASE: Record<string, CuratedDish[]> = {
  madurai: [
    {
      dish: 'Famous Madurai Jigarthanda',
      description: 'Madurai’s world-renowned royal chilled beverage dessert crafted with natural almond gum (badam pisin), herbal nannari roots syrup, sweetened condensed milk, and crowned with rich home-churned basundi ice cream.',
      bestTime: 'Afternoon Refreshment',
      recommendedPlaces: [
        'Famous Jigarthanda (East Marret St - Original)',
        'Famous Jigarthanda (South Masi St Branch)',
        'Murugan Idli Sweet Counter'
      ]
    },
    {
      dish: 'Three-Layer Madurai Kari Dosa',
      description: 'A legendary Madurai non-veg delicacy featuring a thick, fluffy kal dosa base, a seasoned egg omelette layer, and a generous topping of fiery minced mutton or chicken chukka cooked with black pepper and curry leaves.',
      bestTime: 'Evening & Dinner',
      recommendedPlaces: [
        'Amma Mess (Alagar Kovil Road)',
        'Simmakkal Konar Mess',
        'Kumar Mess'
      ]
    },
    {
      dish: 'Crispy Golden Bun Parotta with Spiced Salna',
      description: 'Madurai’s signature innovation: deeply beaten, multi-layered flaky dough rolled into a bun shape, pan-fried in pure ghee until crispy on the outside and soft inside, soaked in spicy vegetable or mutton salna gravy.',
      bestTime: 'Dinner Specialty',
      recommendedPlaces: [
        'Madurai Bun Parotta Kadai (Alagar Kovil Rd)',
        'Amsavalli Bhavan',
        'Sulthan Bun Parotta'
      ]
    },
    {
      dish: 'Melt-in-Mouth Mallipoo Steamed Idlis',
      description: 'Ultra-soft, jasmine-flower-like steamed idlis paired with four distinct freshly ground chutneys (coconut, spicy tomato-onion, coriander, and mint) and piping hot drumstick sambar.',
      bestTime: 'Traditional Breakfast',
      recommendedPlaces: [
        'Murugan Idli Shop (West Masi St)',
        'Sree Sabarees',
        'New Arya Bhavan'
      ]
    },
    {
      dish: 'Madurai Mutton Kola Urundai (Spiced Meatballs)',
      description: 'Melt-in-mouth minced meat or vegetable balls blended with roasted gram, shallots, coconut, and whole Chettinad spices, deep-fried to a golden crunch.',
      bestTime: 'Lunch Starter',
      recommendedPlaces: [
        'Amma Mess (Alagar Kovil Rd)',
        'Konar Mess (Simmakkal)',
        'Chandran Mess'
      ]
    },
    {
      dish: 'Warm Paruthi Paal (Spiced Cotton Seed Milk)',
      description: 'An ancient Madurai wellness drink brewed from fresh cottonseed extract, raw rice flour, palm jaggery, sukku (dry ginger), and green cardamom.',
      bestTime: 'Evening Street Drink',
      recommendedPlaces: [
        'Meenakshi Temple Street Vendors',
        'Town Hall Road Stalls',
        'Chithirai Street Bazaars'
      ]
    }
  ],

  chennai: [
    {
      dish: 'Mylapore Degree Filter Coffee',
      description: 'Rich chicory-balanced dark roast brewed in traditional brass filters, hand-frothed with boiling whole milk and served in a hot brass dabarah and tumbler.',
      bestTime: 'Morning Kickstart',
      recommendedPlaces: [
        'Rayar’s Mess (Mylapore)',
        'Ratna Cafe (Triplicane)',
        'Mylapore Filter Coffee'
      ]
    },
    {
      dish: 'Ghee Podi Masala Roast Dosa',
      description: 'Large thin crepe roasted to a golden amber crispness in pure molten ghee, generously coated with spicy roasted lentil-gunpowder (idli podi) and stuffed with spiced potato masala.',
      bestTime: 'Breakfast & Dinner',
      recommendedPlaces: [
        'Murugan Idli Shop',
        'Saravana Bhavan (Kennet Lane)',
        'Sangeetha Veg Restaurant'
      ]
    },
    {
      dish: 'Marina Beach Thenga-Manga-Pattani Sundal',
      description: 'Warm boiled white peas tempered with crackled mustard seeds, green chillies, curry leaves, fresh grated raw mango, and tender coconut shavings.',
      bestTime: 'Sunset Promenade',
      recommendedPlaces: [
        'Marina Beach Light House Stalls',
        'Besant Nagar (Bessie) Beach Stalls'
      ]
    },
    {
      dish: 'Chettinad Pepper Chicken & Flaky Parotta',
      description: 'Tender chicken cooked with freshly stone-ground black pepper, shallots, fennel, and star anise, accompanied by hot layered parottas.',
      bestTime: 'Lunch / Dinner',
      recommendedPlaces: [
        'Anjappar Chettinad (T. Nagar)',
        'Junior Kuppanna',
        'Velu Military Hotel'
      ]
    },
    {
      dish: 'Sowcarpet Murukku Sandwich',
      description: 'Famous Old Madras street food: tangy mint-coriander chutney, sliced cucumbers, tomatoes, and cheese pressed between two crunchy butter murukkus.',
      bestTime: 'Evening Street Snack',
      recommendedPlaces: [
        'Kakada Ramprasad (Mint Street)',
        'Ajab’s Murukku Sandwich (Sowcarpet)'
      ]
    }
  ],

  coimbatore: [
    {
      dish: 'Kovai Arisi Paruppu Sadam',
      description: 'Wholesome Kongunadu staple of Ponni rice and toor dal cooked together with shallots, cumin, garlic, and dry red chillies, finished with generous ghee.',
      bestTime: 'Authentic Lunch',
      recommendedPlaces: [
        'Valarmathi Kongunaattu Samayal',
        'CS Meals',
        'Sree Annapoorna'
      ]
    },
    {
      dish: 'Sree Annapoorna Ghee Sambar Vadai',
      description: 'Crisp golden medu vadai submerged in Coimbatore’s legendary aromatic drumstick sambar, topped with finely chopped onions and pure ghee.',
      bestTime: 'Morning & Evening Tiffin',
      recommendedPlaces: [
        'Sree Annapoorna Sree Gowrishankar (RS Puram)',
        'Annapoorna (Gandhipuram)'
      ]
    },
    {
      dish: 'Kongunadu Pallipalayam & Nattu Kozhi Curry',
      description: 'Heritage country chicken prepared without water using loads of shallots, garlic, and whole dried red chillies, releasing intoxicating aromas.',
      bestTime: 'Dinner Feast',
      recommendedPlaces: [
        'Hari Bhavanam (Peelamedu)',
        'Valarmathi Kongunaattu Samayal'
      ]
    },
    {
      dish: 'Chilled Elaneer Payasam (Tender Coconut Kheer)',
      description: 'Heavenly dessert made from fresh tender coconut pulp and water simmered in condensed milk, cardamom, and roasted cashews.',
      bestTime: 'Dessert Treat',
      recommendedPlaces: [
        'The French Door',
        'Hari Bhavanam',
        'Annapoorna Caterers'
      ]
    }
  ],

  trichy: [
    {
      dish: 'Trichy Traditional Banana Leaf Feast',
      description: 'Elaborate plantain leaf spread featuring paruppu, vatha kuzhambu, kootu, poriyal, appalam, curd, payasam, and steamed ponni rice.',
      bestTime: 'Grand Lunch',
      recommendedPlaces: [
        'Sri Sangeethas (Collector Office Rd)',
        'Vasanta Bhavan (Railway Junction)',
        'Hotel Kannappa'
      ]
    },
    {
      dish: 'Fiery Trichy Kothu Parotta & Salna',
      description: 'Shredded layered parottas beaten on an iron griddle with eggs, onions, green chillies, and aromatic salna gravy with rhythmic steel spatula clatter.',
      bestTime: 'Dinner',
      recommendedPlaces: [
        'Hotel Kannappa',
        'Michael’s Ice Cream & Fast Food',
        'Buhari Hotel'
      ]
    },
    {
      dish: 'Tiruchirappalli Badusha & Dry Jamun',
      description: 'Ghee-fried flaky sweet badusha with sugar glazing and legendary dry gulab jamuns coated with desiccated coconut.',
      bestTime: 'Sweet Delight',
      recommendedPlaces: [
        'Michael’s Ice Cream & Sweets',
        'Sri Sangeethas Sweets',
        'Vasanta Bhavan Sweet Stall'
      ]
    }
  ],

  thanjavur: [
    {
      dish: 'Thanjavur Royal Ash Gourd Kootu & Sambar Sadam',
      description: 'Chola heritage recipe of ash gourd, lentils, and freshly toasted spices cooked to silky perfection, paired with hot papadums.',
      bestTime: 'Temple Lunch',
      recommendedPlaces: [
        'Hotel Gnanam (Diana Restaurant)',
        'Sri Thillai Cafe',
        'Sathars Restaurant'
      ]
    },
    {
      dish: 'Kumbakonam Authentic Degree Coffee',
      description: 'Pure cow’s milk unadulterated by water, combined with high-grade plantation filter coffee decoction in brassware.',
      bestTime: 'Morning & Afternoon',
      recommendedPlaces: [
        'Original Kumbakonam Degree Coffee (Near Big Temple)',
        'Rajarajan Coffee Outlet'
      ]
    },
    {
      dish: 'Thanjavur Kadappa & Fluffy Idli',
      description: 'Silky stew of moong dal, potatoes, fennel, coconut, and garlic that pairs delightfully with hot idlis or dosas.',
      bestTime: 'Breakfast Special',
      recommendedPlaces: [
        'Sathars Restaurant',
        'Hotel Gnanam',
        'Mani Vilas'
      ]
    }
  ],

  kumbakonam: [
    {
      dish: 'Authentic Kumbakonam Degree Filter Coffee',
      description: 'Legendary South Indian brass-filter coffee brewed exclusively with pure chicory-free plantation coffee beans and undiluted, frothy cow’s milk, served in traditional brass davarah and tumbler.',
      bestTime: 'Morning & Twilight Break',
      recommendedPlaces: [
        'Kumbakonam Degree Coffee (Tanjore Main Rd)',
        'Murali Cafe (Near Mahamaham Tank)',
        'Venkatramana Hotel'
      ]
    },
    {
      dish: 'Kumbakonam Kadappa with Hot Steamed Idlis',
      description: 'A delicate, fragrant Thanjavur delta stew prepared with boiled moong dal, mashed potatoes, coconut-fennel paste, and green chillies, served as the quintessential breakfast gravy.',
      bestTime: 'Traditional Breakfast',
      recommendedPlaces: [
        'Mangalambika Coffee Hotel (Big Bazaar St)',
        'Hotel Rayas',
        'Sri Balaji Bhavan'
      ]
    },
    {
      dish: 'Crispy Thavala Adai & Kumbakonam Dry Fruit Halwa',
      description: 'Golden, thick pan-roasted savory lentil pancake studded with coconut slices, followed by rich wheat halwa garnished with cashews and ghee.',
      bestTime: 'Evening Tiffin & Dessert',
      recommendedPlaces: [
        'Murari Sweets (Town Hall Rd)',
        'Sri Sangeetha Restaurant',
        'Vasan Cafe'
      ]
    }
  ],

  kanyakumari: [
    {
      dish: 'Kanyakumari Coastal Fish Curry & Tapioca (Kappa Meen)',
      description: 'Fresh ocean seer or kingfish simmered in a spicy, tangy gravy of kudampuli (cambogia) and coconut milk, served with boiled seasoned tapioca.',
      bestTime: 'Coastal Lunch',
      recommendedPlaces: [
        'Hotel Saravana',
        'Triveni Restaurant',
        'The Ocean Heritage Restaurant'
      ]
    },
    {
      dish: 'Nanjil Nadu Pepper Chicken Roast',
      description: 'Spicy country chicken tossed with black pepper, curry leaves, and coconut oil, unique to the Kanyakumari district border region.',
      bestTime: 'Dinner',
      recommendedPlaces: [
        'The Ocean Restaurant',
        'Hotel Seaview Dining Room',
        'Kumar Mess'
      ]
    },
    {
      dish: 'Pazham Pori (Golden Banana Fritters) with Sukku Coffee',
      description: 'Sweet Nendran bananas dipped in spiced batter, fried golden, and enjoyed with herbal dried ginger coffee overlooking the three oceans.',
      bestTime: 'Sunset Refreshment',
      recommendedPlaces: [
        'Sunset Point Beach Cafes',
        'Triveni Sangam Stalls'
      ]
    }
  ],

  rameswaram: [
    {
      dish: 'Freshly Caught Pamban Fish & Prawn Tawa Fry',
      description: 'Locally caught sea prawns and fish marinated in red chilli, turmeric, and lemon juice, tawa-fried hot on cast iron skillets.',
      bestTime: 'Seaside Lunch',
      recommendedPlaces: [
        'Hotel Guru Dining Hall',
        'Sri Murugan Mess',
        'Ahaan The Restaurant'
      ]
    },
    {
      dish: 'Temple Style Puliyodharai (Tamarind Rice)',
      description: 'Aromatic rice seasoned with boiled tamarind pulp, roasted peanuts, sesame oil, curry leaves, and sundried red chillies.',
      bestTime: 'Pilgrim Breakfast',
      recommendedPlaces: [
        'Ramanathaswamy Temple Prasadam Counter',
        'Gujarat Bhavan Bhojanalaya'
      ]
    },
    {
      dish: 'Rameswaram Kadalai Mittai & Mysore Pak',
      description: 'Crunchy jaggery-coated peanut brittle cakes and ghee Mysore pak from traditional sweet artisans.',
      bestTime: 'Travel Snack',
      recommendedPlaces: [
        'Rameswaram Temple Bazaar Sweets',
        'Sri Murugan Sweet Corner'
      ]
    }
  ],

  ooty: [
    {
      dish: 'Handmade Nilgiri Dark Chocolate Truffles',
      description: 'Locally churned rich dark chocolates with roasted hazelnuts, almonds, rum-raisin, and mint crafted in cool hill climate.',
      bestTime: 'All-Day Delight',
      recommendedPlaces: [
        'King Star Bakery (Commercial Road - since 1942)',
        'Modern Stores',
        'Moddy’s Chocolates'
      ]
    },
    {
      dish: 'Fresh Orthodox Nilgiri Black Tea & Crispy Varkey',
      description: 'Delicately floral high-grown Nilgiri tea accompanied by authentic puffed, flaky layered Ooty varkey biscuits.',
      bestTime: 'Morning / Evening Tea',
      recommendedPlaces: [
        'Doddabetta Tea Factory Tea Bar',
        'Earl’s Secret (Kings Cliff)',
        'Modern Stores'
      ]
    },
    {
      dish: 'Steamed Tibetan Momos with Spicy Sesame Chutney',
      description: 'Juicy handmade vegetable or meat dumplings wrapped in delicate dough and steamed hot in tiered bamboo steamers.',
      bestTime: 'Chilly Evening Comfort',
      recommendedPlaces: [
        'Shinkow’s Chinese Restaurant',
        'Tibetan Market Food Stalls',
        'Willy’s Coffee Pub'
      ]
    }
  ],

  kodaikanal: [
    {
      dish: 'Handcrafted Artisan Chocolate Fudge',
      description: 'Rich, chewy melted cocoa fudge studded with roasted walnuts and pecans, perfected in Kodai’s mountain air.',
      bestTime: 'Afternoon Treat',
      recommendedPlaces: [
        'Pastry Corner (Seven Roads Junction)',
        'Cloud Street Bakery',
        'Manna Bake'
      ]
    },
    {
      dish: 'Hilltop Filter Coffee & Butter Dosa',
      description: 'Crisp buttery dosa served with piping coconut and tomato chutneys alongside freshly brewed estate arabica coffee.',
      bestTime: 'Morning Breakfast',
      recommendedPlaces: [
        'Astoria Veg',
        'Muncheez',
        'Hilltop Cafe'
      ]
    },
    {
      dish: 'Warm Tibetan Thukpa (Noodle Soup)',
      description: 'Steaming bowl of hand-pulled noodles, julienned seasonal vegetables, ginger, garlic, and warming broth.',
      bestTime: 'Mist-Covered Dinner',
      recommendedPlaces: [
        'Royal Tibet',
        'Tibetan Brother’s Restaurant'
      ]
    }
  ],

  pondicherry: [
    {
      dish: 'French Almond Croissant & Cafe au Lait',
      description: 'Buttery multi-layered French croissant filled with rich almond cream, dusted with powdered sugar, paired with cafe au lait.',
      bestTime: 'Morning Breakfast',
      recommendedPlaces: [
        'Baker Street (Rue de Bussy)',
        'Cafe des Arts',
        'Coromandel Cafe'
      ]
    },
    {
      dish: 'Pondicherry Creole Prawn Curry with Baguette',
      description: 'Unique Franco-Tamil fusion curry made with fresh coastal prawns, coconut milk, curry leaves, and French wine vinegar.',
      bestTime: 'Lunch in White Town',
      recommendedPlaces: [
        'Carte Blanche (Hotel de l’Orient)',
        'Maison Perumal',
        'Villa Shanti'
      ]
    },
    {
      dish: 'Wood-Fired Neapolitan Margherita Pizza',
      description: 'Charred bubbly crust, San Marzano tomato sauce, fresh buffalo mozzarella, and fresh basil leaves.',
      bestTime: 'Dinner',
      recommendedPlaces: [
        'Cafe Xtasi',
        'Tanto Pizzeria (Auroville Road)'
      ]
    }
  ],

  tirunelveli: [
    {
      dish: 'Authentic Tirunelveli Iruttu Kadai Halwa',
      description: 'World-famous dark amber translucent halwa made from fermented wheat milk extract, pure ghee, and sugar, served warm on lotus leaves.',
      bestTime: 'Evening (Fresh Batch at 17:30)',
      recommendedPlaces: [
        'Iruttu Kadai (Opposite Nellaiappar Temple)',
        'Shanthi Sweets',
        'Nellai Halwa Stall'
      ]
    },
    {
      dish: 'Nellai Sodhi & Spiced Potato Roast',
      description: 'Creamy coconut milk stew infused with drumsticks, carrots, and moong dal, served over steamed rice with spicy potato roast and ginger pachadi.',
      bestTime: 'Special Festive Lunch',
      recommendedPlaces: [
        'Sri Nellaiappar Hotel',
        'Sri Annapoorna Tirunelveli',
        'Hotel Aryas'
      ]
    }
  ],

  bengaluru: [
    {
      dish: 'Vidyarthi Bhavan Crispy Ghee Benne Dosa',
      description: 'Legendary thick, crispy golden-brown dosa soaked in home-churned butter, accompanied by thick coconut chutney.',
      bestTime: 'Morning Breakfast',
      recommendedPlaces: [
        'Vidyarthi Bhavan (Gandhi Bazaar - since 1943)',
        'CTR (Central Tiffin Room - Malleshwaram)',
        'Taaza Thindi'
      ]
    },
    {
      dish: 'Bisi Bele Bath with Spiced Boondi',
      description: 'Nutritious Karnataka one-pot harmony of rice, toor dal, seasonal vegetables, tamarind, and spicy bisi bele bath masala with melting ghee.',
      bestTime: 'Lunch Comfort',
      recommendedPlaces: [
        'MTR (Lalbagh Road)',
        'Brahmins’ Coffee Bar',
        'Maiyas'
      ]
    },
    {
      dish: 'Melt-in-Mouth Royal Mysore Pak',
      description: 'Pure desi ghee, roasted chickpea flour, and saffron cardamom syrup fused into a golden, crumbly royal dessert.',
      bestTime: 'Sweet Indulgence',
      recommendedPlaces: [
        'Sri Venkateshwara Sweetmeat Stall (Balepet)',
        'Kanti Sweets',
        'Anand Sweets'
      ]
    }
  ],

  mysuru: [
    {
      dish: 'Original Guru Sweets Mysore Pak',
      description: 'The authentic original Mysore Pak prepared using the confidential century-old royal recipe of the Wadiyar royal court.',
      bestTime: 'Royal Tasting',
      recommendedPlaces: [
        'Guru Sweets Mart (Sayyaji Rao Road)',
        'Mahalaxmi Sweets'
      ]
    },
    {
      dish: 'Mylari Butter Masala Dosa',
      description: 'Ultra-spongy, melting soft dosa smeared with spiced onion-cilantro paste and crowned with fresh white butter dollop.',
      bestTime: 'Breakfast & Evening',
      recommendedPlaces: [
        'Original Vinayaka Mylari Hotel (Nazarbad)',
        'Gayatri Tiffin Room (GTR)'
      ]
    }
  ],

  hyderabad: [
    {
      dish: 'Authentic Hyderabadi Dum Biryani',
      description: 'Saffron-infused long-grain basmati rice and marinated tender lamb cooked together under sealed dough dum over slow charcoal coals.',
      bestTime: 'Feast Lunch & Dinner',
      recommendedPlaces: [
        'Bawarchi (RTC X Roads)',
        'Cafe Bahar (Hyderguda)',
        'Paradise (Secunderabad)',
        'Hotel Shadab'
      ]
    },
    {
      dish: 'Nimrah Irani Chai & Osmania Biscuits',
      description: 'Creamy, slow-simmered spiced condensed black tea paired with melt-in-mouth sweet-salty Osmania biscuits with Charminar view.',
      bestTime: 'Morning & Sunset',
      recommendedPlaces: [
        'Nimrah Cafe & Bakery (Charminar)',
        'Niloufer Cafe (Lakdikapul)',
        'Subhan Bakery'
      ]
    },
    {
      dish: 'Royal Hyderabadi Double Ka Meetha & Haleem',
      description: 'Deep-fried bread soaked in cardamom saffron condensed milk (rabri) with toasted almonds, alongside rich slow-cooked wheat-meat Haleem.',
      bestTime: 'Evening Indulgence',
      recommendedPlaces: [
        'Hotel Shadab (Ghansi Bazaar)',
        'Pista House',
        'Shah Ghouse'
      ]
    }
  ],

  kochi: [
    {
      dish: 'Lacy Appam with Creamy Vegetable / Chicken Stew',
      description: 'Crisp-edged bowl-shaped fermented rice hoppers with soft spongy centers, served with rich coconut milk stew infused with whole cloves and cinnamon.',
      bestTime: 'Heritage Breakfast',
      recommendedPlaces: [
        'Paragon Restaurant',
        'Dhe Puthu',
        'Kashi Art Cafe (Fort Kochi)'
      ]
    },
    {
      dish: 'Karimeen Pollichathu (Pearl Spot Fish in Banana Leaf)',
      description: 'Backwater Pearl Spot fish coated in spicy shallot, ginger, garlic, and tomato masala, wrapped securely in scorched banana leaf and pan-roasted.',
      bestTime: 'Coastal Lunch',
      recommendedPlaces: [
        'Fusion Bay (Fort Kochi)',
        'Grand Hotel Pavilion',
        'Oceanos Restaurant'
      ]
    },
    {
      dish: 'Flaky Kerala Parotta with Spiced Beef Roast / Mushroom Pepper',
      description: 'Flaky multi-layered spiral flatbread served with tender meat or mushrooms slow-roasted with coconut chips and crushed peppercorns.',
      bestTime: 'Dinner Delight',
      recommendedPlaces: [
        'Paragon Restaurant',
        'Kayees Rahmathulla Hotel (Mattancherry)'
      ]
    }
  ],

  mumbai: [
    {
      dish: 'Iconic Mumbai Vada Pav with Garlic Chutney',
      description: 'Spiced mashed potato fritter in golden chickpea batter, sandwiched in soft pav smeared with dry garlic-coconut chutney and green chillies.',
      bestTime: 'All-Day Street Food',
      recommendedPlaces: [
        'Ashok Vada Pav (Kirti College, Dadar)',
        'Aram Milk Bar (Opposite CST)',
        'Graduate Vada Pav (Byculla)'
      ]
    },
    {
      dish: 'Sizzling Butter Pav Bhaji',
      description: 'Mashed medley of potatoes, tomatoes, peas, and bell peppers spiced on an enormous flat iron tava and drowned in Amul butter.',
      bestTime: 'Evening & Dinner',
      recommendedPlaces: [
        'Sardar Refreshments (Tardeo)',
        'Cannon Pav Bhaji (Fort CST)',
        'Amar Juice Centre (Juhu)'
      ]
    },
    {
      dish: 'Irani Bun Maska & Irani Chai',
      description: 'Sweet pillowy bun stuffed with fresh salty butter, dunked into hot, sweet, cardamom-spiced milky tea.',
      bestTime: 'Morning Breakfast',
      recommendedPlaces: [
        'Kyani & Co. (Marine Lines - since 1904)',
        'Britannia & Co. (Ballard Estate)',
        'Yazdani Bakery'
      ]
    }
  ],

  delhi: [
    {
      dish: 'Old Delhi Butter Chicken with Garlic Butter Naan',
      description: 'Tandoor-charred chicken simmered in a silky, rich gravy of ripe tomatoes, butter, cashew paste, dried fenugreek (kasuri methi), and cream.',
      bestTime: 'Dinner Feast',
      recommendedPlaces: [
        'Karim’s (Gali Kababian, Jama Masjid)',
        'Moti Mahal (Daryaganj - birthplace)',
        'Gulati (Pandara Road)'
      ]
    },
    {
      dish: 'Paranthe Wali Gali Deep-Fried Stuffed Parathas',
      description: 'Crisp golden whole wheat parathas stuffed with spiced potatoes, cauliflower, rabri, or paneer, served with sweet pumpkin curry and mint chutney.',
      bestTime: 'Lunch',
      recommendedPlaces: [
        'Pandit Gaya Prasad Shiv Charan (Chandni Chowk)',
        'Kake Di Hatti (Khari Baoli)'
      ]
    },
    {
      dish: 'Crispy Chole Bhature with Pickled Chillies',
      description: 'Gigantic puffy deep-fried bhaturas served with spicy dark chickpeas cooked with anardana (pomegranate seeds) and pickled amla.',
      bestTime: 'Hearty Breakfast',
      recommendedPlaces: [
        'Sita Ram Diwan Chand (Paharganj)',
        'Chache Di Hatti (Kamla Nagar)'
      ]
    }
  ],

  jaipur: [
    {
      dish: 'Traditional Rajasthani Dal Baati Churma',
      description: 'Hard wheat flour baatis baked over cow dung cakes, cracked and soaked in pure desi ghee, paired with five-lentil dal and sweet powdered churma.',
      bestTime: 'Royal Lunch',
      recommendedPlaces: [
        'Rawat Mishthan Bhandar (Station Road)',
        'LMB - Laxmi Mishthan Bhandar (Johari Bazaar)',
        'Chokhi Dhani'
      ]
    },
    {
      dish: 'Crispy Golden Pyaaz Ki Kachori',
      description: 'Flaky, deep-fried puff pastry stuffed with spicy caramelised onion and gram flour filling, served with sweet tamarind and spicy mint chutneys.',
      bestTime: 'Morning Breakfast',
      recommendedPlaces: [
        'Rawat Mishthan Bhandar',
        'Sodhani Sweets (Tonk Road)'
      ]
    },
    {
      dish: 'Kesar Malai Ghewar',
      description: 'Intricate honeycomb-textured Rajasthani sweet soaked in fragrant saffron sugar syrup and topped with thick malai cream and silver leaf.',
      bestTime: 'Festive Dessert',
      recommendedPlaces: [
        'LMB Sweets (Johari Bazaar)',
        'Doodh Mishthan Bhandar (Lal Kothi)'
      ]
    }
  ],

  amritsar: [
    {
      dish: 'Authentic Amritsari Kulcha with Pindi Chole',
      description: 'Flaky, multi-layered tandoori flatbread stuffed with spiced potatoes, onions, and paneer, generously brushed with desi ghee, served with tangy dark chickpea curry and tamarind-onion chutney.',
      bestTime: 'Hearty Morning Breakfast',
      recommendedPlaces: [
        'Kulcha Land (Ranjit Avenue)',
        'Bhai Kulwant Singh Kulchian Wale (Near Golden Temple)',
        'All India Famous Amritsari Kulcha (Maqbool Road)'
      ]
    },
    {
      dish: 'Harmandir Sahib Langar Mah Ki Daal & Kheer',
      description: 'Sacred, slow-simmered black urad dal and fragrant basmati rice kheer cooked with devotion in the Golden Temple’s world-famous community mega-kitchen.',
      bestTime: 'Spiritual Community Lunch',
      recommendedPlaces: [
        'Sri Harmandir Sahib Guru-Ka-Langar (Golden Temple Complex)'
      ]
    },
    {
      dish: 'Kesar Da Dhaba Dal Makhani & Lachha Paratha',
      description: 'Rich black lentils simmered in copper cauldrons over charcoal embers for over 12 hours, finished with pure desi ghee and served with smoky crisp parathas.',
      bestTime: 'Heritage Dinner',
      recommendedPlaces: [
        'Kesar Da Dhaba (Chowk Passian - since 1916)',
        'Bharawan Da Dhaba (Town Hall)',
        'Makhan Fish & Chicken Corner (Majitha Rd)'
      ]
    },
    {
      dish: 'Thick Malai Amritsari Lassi in Clay Kulhad',
      description: 'Velvety sweet yogurt churned fresh, infused with cardamom and rose water, topped with a towering scoop of rich clotted milk cream (malai).',
      bestTime: 'Afternoon Refreshment',
      recommendedPlaces: [
        'Ahuja Milk Centre (Near Hindu College)',
        'Gian Chand Lassi Wale (Chowk Regent)',
        'Kanha Sweets (Lawrence Road)'
      ]
    }
  ],

  udaipur: [
    {
      dish: 'Traditional Mewari Dal Baati Churma',
      description: 'Wood-fired wheat balls dipped in bubbling desi ghee, served alongside spicy five-lentil Panchmel dal, fiery garlic chutney, and sweet cardamom-almond churma.',
      bestTime: 'Royal Lakeside Lunch',
      recommendedPlaces: [
        'Krishna Dal Bati Restro (Jalsham Marg)',
        'Traditional Khana (Panchwati)',
        'Santosh Bhojnalaya (Near Surajpole)'
      ]
    },
    {
      dish: 'Mewari Gatte Ki Sabzi & Ker Sangri',
      description: 'Tender spiced gram flour dumplings simmered in a luscious curd gravy, served with authentic desert beans and wild capers seasoned with red chilies.',
      bestTime: 'Dinner by Lake Pichola',
      recommendedPlaces: [
        '1559 AD (Near Chetak Circle)',
        'Ambrai Restaurant (Amet Haveli, Lake Pichola)',
        'Upre by 1927 (Lake Pichola View)'
      ]
    },
    {
      dish: 'Kesariya Rabdi with Hot Pyaaz Kachori',
      description: 'Crisp flaky pastry bursting with spiced caramelised onions and green chillies, crowned by chilled earthen pot saffron rabdi.',
      bestTime: 'Morning Street Tiffin',
      recommendedPlaces: [
        'Jagdish Mishthan Bhandar - JMB (Surajpole)',
        'Shastri Sweets (Shastri Circle)',
        'Bhole Misthan Bhandar'
      ]
    }
  ],

  varanasi: [
    {
      dish: 'Banarasi Kachori Jalebi with Aloo Chana Sabzi',
      description: 'Crisp lentil-stuffed kachoris served with spicy hing-infused potato curry, followed immediately by piping hot crispy orange jalebis.',
      bestTime: 'Morning Ghat Breakfast',
      recommendedPlaces: [
        'Ram Bhandar (Thatheri Bazaar)',
        'Madhur Milan (Dashashwamedh)',
        'Shree Rajbandhu Sweets'
      ]
    },
    {
      dish: 'Famous Banarasi Tamatar Chaat',
      description: 'Unique Varanasi specialty: stewed spiced tomatoes, hing, potatoes, and cashew nuts drizzled with warm sugar-cumin syrup and crisp namkeen.',
      bestTime: 'Evening Street Snack',
      recommendedPlaces: [
        'Kashi Chaat Bhandar (Godowlia)',
        'Deena Chaat Bhandar (Luxa Road)'
      ]
    },
    {
      dish: 'Winter Saffron Malaiyo & Creamy Lassi',
      description: 'Ethereal dessert of overnight milk froth exposed to winter morning mist, flavored with saffron, pistachios, and served in earthen clay kulhads.',
      bestTime: 'Morning & Afternoon',
      recommendedPlaces: [
        'Blue Lassi Shop (Near Manikarnika Ghat)',
        'Markandey Malaiyo (Chowk)',
        'Pehalwan Lassi (Lanka)'
      ]
    },
    {
      dish: 'Authentic Banarasi Meetha Paan',
      description: 'Fragrant betel leaf folded with gulkand (rose petal preserve), sweet areca nut, candied fennel, cloves, and silver foil.',
      bestTime: 'Post-Dinner Ritual',
      recommendedPlaces: [
        'Keshav Tambul Bhandar (BHU Gate)',
        'Gopal Paan Bhandar (Godowlia)'
      ]
    }
  ],

  goa: [
    {
      dish: 'Goan Fish Curry Thali with Red Rice',
      description: 'Fresh kingfish or pomfret simmered in a vibrant coconut, Kashmiri chilli, and tangy kokum gravy, served with Goan red boiled rice and fried fish.',
      bestTime: 'Authentic Lunch',
      recommendedPlaces: [
        'Ritz Classic (Panaji)',
        'Fisherman’s Wharf (Cavelossim)',
        'Vinayak Family Restaurant (Assagao)'
      ]
    },
    {
      dish: 'Spicy Prawn Balchão & Crusty Poi Bread',
      description: 'Fiery pickled prawn dish cooked with red chillies, garlic, and sugarcane toddy vinegar, scooped with hot traditional Goan poi bread.',
      bestTime: 'Dinner',
      recommendedPlaces: [
        'Martin’s Corner (Betalbatim)',
        'Mum’s Kitchen (Panaji)',
        'Viva Panjim'
      ]
    },
    {
      dish: 'Traditional Seven-Layered Bebinca',
      description: 'Rich Indo-Portuguese baked dessert made from coconut milk, egg yolks, flour, nutmeg, and ghee, baked layer by individual layer.',
      bestTime: 'Dessert',
      recommendedPlaces: [
        'Confeitaria 31 de Janeiro (Fontainhas)',
        'Viva Panjim',
        'Infantaria Cafe (Baga)'
      ]
    }
  ],

  paris: [
    {
      dish: 'Artisan Butter Croissant & Pain au Chocolat',
      description: '100% butter multi-layered flaky croissant baked fresh at dawn, delicate crisp exterior revealing honeycombed airy pastry.',
      bestTime: 'Morning Breakfast',
      recommendedPlaces: [
        'Du Pain et des Idées (10th Arr.)',
        'Carette (Place des Vosges)',
        'Cafe de Flore (Saint-Germain)'
      ]
    },
    {
      dish: 'Confit de Canard (Crispy Duck Leg Confit)',
      description: 'Slow-cooked duck leg cured in coarse salt and gently poached in its own fat until fork-tender with crispy skin, served with garlic pomme sarladaise.',
      bestTime: 'Dinner',
      recommendedPlaces: [
        'Bouillon Chartier (Grands Boulevards)',
        'Chez Janou (Le Marais)',
        'Le Comptoir du Relais'
      ]
    },
    {
      dish: 'Soupe à l’Oignon Gratinée',
      description: 'Rich beef bouillon with deeply caramelized sweet onions, topped with crusty French baguette and broiled molten Gruyère cheese.',
      bestTime: 'Lunch / Evening',
      recommendedPlaces: [
        'Au Pied de Cochon (Les Halles)',
        'Les Philosophes (Le Marais)'
      ]
    }
  ],

  london: [
    {
      dish: 'Traditional Beer-Battered Fish and Chips',
      description: 'Crisp golden beer-battered fresh Atlantic cod or haddock served with chunky potato chips, mushy peas, and homemade tartare sauce.',
      bestTime: 'Classic Lunch',
      recommendedPlaces: [
        'Poppies Fish & Chips (Spitalfields)',
        'The Golden Hind (Marylebone)',
        'Rock & Sole Plaice (Covent Garden)'
      ]
    },
    {
      dish: 'Sunday Roast with Yorkshire Pudding',
      description: 'Aged roast beef with towering crispy Yorkshire pudding, duck-fat roast potatoes, honey-glazed parsnips, and rich bone-marrow gravy.',
      bestTime: 'Sunday Feast',
      recommendedPlaces: [
        'Hawksmoor (Seven Dials)',
        'The Wolseley (Mayfair)',
        'The Harwood Arms (Fulham)'
      ]
    },
    {
      dish: 'Afternoon Tea with Warm Scones & Clotted Cream',
      description: 'Tower of cucumber finger sandwiches, warm buttermilk scones slathered with Cornish clotted cream and strawberry jam, with rare teas.',
      bestTime: 'Afternoon High Tea',
      recommendedPlaces: [
        'Fortnum & Mason (Piccadilly)',
        'The Ritz London',
        'Sketch (Mayfair)'
      ]
    }
  ],

  rome: [
    {
      dish: 'Spaghetti alla Carbonara',
      description: 'Silky pasta tossed with crispy cured guanciale pork jowl, farm egg yolks, and copious freshly grated Pecorino Romano cheese with crushed black pepper.',
      bestTime: 'Dinner',
      recommendedPlaces: [
        'Da Enzo al 29 (Trastevere)',
        'Roscioli Salumeria con Cucina',
        'Tonnarello (Trastevere)'
      ]
    },
    {
      dish: 'Cacio e Pepe',
      description: 'Roman minimalist masterpiece: thick handmade tonnarelli pasta emulsified with starchy pasta water, aged Pecorino Romano, and toasted black pepper.',
      bestTime: 'Lunch',
      recommendedPlaces: [
        'Felice a Testaccio',
        'Osteria da Fortunata (Campo de’ Fiori)',
        'Flavio al Velavevodetto'
      ]
    },
    {
      dish: 'Artisanal Roman Gelato',
      description: 'Slow-churned velvety Italian gelato crafted with Bronte pistachios, Piedmont hazelnuts, and dark Venezuelan chocolate.',
      bestTime: 'Evening Stroll',
      recommendedPlaces: [
        'Gelateria del Teatro (Via dei Coronari)',
        'Frigidarium',
        'Giolitti (near Pantheon)'
      ]
    }
  ],

  tokyo: [
    {
      dish: 'Tsukiji / Toyosu Fresh Edomae Nigiri Sushi',
      description: 'Pristine morning catch of fatty tuna (otoro), sea urchin (uni), and sea bream hand-pressed over warm seasoned sushi rice by master itamae chefs.',
      bestTime: 'Morning / Early Lunch',
      recommendedPlaces: [
        'Sushi Dai (Toyosu Market)',
        'Daiwa Sushi (Toyosu)',
        'Midori Sushi (Shibuya)'
      ]
    },
    {
      dish: 'Authentic Rich Tonkotsu & Shoyu Ramen',
      description: '20-hour simmered pork bone broth with springy handmade noodles, melting chashu pork belly, seasoned soft-boiled ajitsuke egg, and nori.',
      bestTime: 'Dinner',
      recommendedPlaces: [
        'Ichiran (Shibuya / Shinjuku)',
        'Afuri (Harajuku)',
        'Fuunji (Shinjuku - Tsukemen)'
      ]
    },
    {
      dish: 'Matcha Daifuku Mochi & Asakusa Dango',
      description: 'Soft chewy rice cake filled with sweetened red azuki bean paste and premium Uji green tea cream along the historic temple market.',
      bestTime: 'Afternoon Treat',
      recommendedPlaces: [
        'Suzukien (Asakusa - 7 levels of matcha)',
        'Asakusa Chaya Tabane-no-ha',
        'Nakamise-dori Vendors'
      ]
    }
  ],

  dubai: [
    {
      dish: 'Traditional Emirati Lamb Al Machboos',
      description: 'Tender slow-simmered spiced lamb served atop fragrant basmati rice cooked in whole spices (loomi dried lime, cloves, cardamom, and saffron).',
      bestTime: 'Lunch Feast',
      recommendedPlaces: [
        'Al Fanar Restaurant & Cafe (Dubai Festival City)',
        'Arabian Tea House (Al Fahidi Heritage District)',
        'Aseelah (Deira)'
      ]
    },
    {
      dish: 'Authentic Shawarma with Creamy Garlic Toum',
      description: 'Thinly shaved spit-roasted chicken or lamb wrapped in warm khubz flatbread with garlicky toum, pickled turnip, and hand-cut fries.',
      bestTime: 'Evening Snack',
      recommendedPlaces: [
        'Al Ustad Special Kabab (Meena Bazaar)',
        'Al Mallah (2nd December St)',
        'Al Safadi (Sheikh Zayed Rd)'
      ]
    },
    {
      dish: 'Warm Cheese Kunafa',
      description: 'Golden crisp shredded kataifi pastry soaked in floral rose-orange blossom syrup, layered over stretchy sweet Nabulsi cheese and crushed pistachios.',
      bestTime: 'Night Dessert',
      recommendedPlaces: [
        'Bosporus Turkish Restaurant (Downtown)',
        'Feras Sweets',
        'Qwaider Al Nabulsi'
      ]
    }
  ],

  singapore: [
    {
      dish: 'Hainanese Chicken Rice',
      description: 'Succulent poached chicken served with fragrant rice cooked in chicken broth, ginger, and pandan leaves, accompanied by fiery chilli sauce and dark soy.',
      bestTime: 'Lunch',
      recommendedPlaces: [
        'Tian Tian Hainanese Chicken Rice (Maxwell Food Centre)',
        'Boon Tong Kee (Balestier)',
        'Liao Fan Hawker Chan'
      ]
    },
    {
      dish: 'Singapore Chili Crab with Golden Mantou',
      description: 'Mud crab stir-fried in a rich, sweet, and savoury chilli-tomato sauce thickened with whisked eggs, mopped with deep-fried golden mantou buns.',
      bestTime: 'Seafood Dinner',
      recommendedPlaces: [
        'Jumbo Seafood (Riverside Point, Clarke Quay)',
        'Long Beach Seafood (East Coast)',
        'No Signboard Seafood'
      ]
    },
    {
      dish: 'Traditional Kaya Toast & Soft-Boiled Eggs with Kopi',
      description: 'Charcoal-grilled thin white bread slathered with coconut-pandan kaya jam and cold butter, served with soft-boiled eggs splashed with dark soy and white pepper.',
      bestTime: 'Morning Heritage Breakfast',
      recommendedPlaces: [
        'Ya Kun Kaya Toast (China Street)',
        'Tong Ah Eating House (Keong Saik)',
        'Chin Mee Chin Confectionery'
      ]
    }
  ],

  bangkok: [
    {
      dish: 'Authentic Pad Thai with Jumbo River Prawns',
      description: 'Wok-fried rice noodles with tamarind pulp, palm sugar, fish sauce, pressed tofu, egg, and crushed peanuts, crowned with grilled river prawns.',
      bestTime: 'Dinner',
      recommendedPlaces: [
        'Thipsamai Pad Thai (Pratu Phi)',
        'Raan Jay Fai (Maha Chai Rd)',
        'Baan Phadthai (Charoen Krung)'
      ]
    },
    {
      dish: 'Tom Yum Goong & Crab Omelette',
      description: 'Hot and sour aromatic soup infused with lemongrass, kaffir lime leaves, galangal, fresh prawns, and bird’s eye chillies.',
      bestTime: 'Lunch Feast',
      recommendedPlaces: [
        'Raan Jay Fai (Michelin Street Food)',
        'Pe Aor Tom Yum Kung (Phaya Thai)',
        'Krua Apsorn'
      ]
    },
    {
      dish: 'Sweet Mango Sticky Rice (Khao Niew Mamuang)',
      description: 'Warm coconut milk glutinous rice paired with ripe, honeyed Nam Dok Mai mango slices and crunchy toasted mung beans.',
      bestTime: 'Dessert',
      recommendedPlaces: [
        'Mae Varee Sweet Mango (Thong Lo)',
        'Kor Panich (Tanao Road - since 1932)'
      ]
    }
  ],

  new_york: [
    {
      dish: 'Classic NYC Hand-Carved Pastrami on Rye',
      description: 'Piled-high warm, spiced, and smoked beef brisket pastrami on crusty rye bread slathered with spicy deli mustard and half-sour pickles.',
      bestTime: 'Lunch',
      recommendedPlaces: [
        'Katz’s Delicatessen (Lower East Side)',
        '2nd Ave Deli',
        'Pastrami Queen (Upper East Side)'
      ]
    },
    {
      dish: 'Hot Kettle-Boiled Bagel with Schmear & Lox',
      description: 'Chewy malted bagel with a crisp crust, smeared with scallion cream cheese, paper-thin Scottish smoked salmon, red onion, and capers.',
      bestTime: 'Morning Breakfast',
      recommendedPlaces: [
        'Russ & Daughters (Houston St)',
        'Ess-a-Bagel (3rd Ave)',
        'Absolute Bagels (Broadway)'
      ]
    },
    {
      dish: 'Foldable Coal-Oven Pepperoni Pizza Slice',
      description: 'Thin crisp foldable dough topped with sweet crushed San Marzano tomato sauce, aged mozzarella, and cupped charred pepperoni.',
      bestTime: 'Lunch / Late Night',
      recommendedPlaces: [
        'Joe’s Pizza (Carmine St, Greenwich Village)',
        'Scarr’s Pizza (Orchard St)',
        'L’Industrie Pizzeria (Williamsburg)'
      ]
    }
  ]
};

/**
 * Returns curated authentic culinary highlights and famous eateries for any city/district.
 */
export function getCuratedDiningForCity(city: string): CuratedDish[] {
  const norm = city.trim().toLowerCase();

  for (const [key, dishes] of Object.entries(CURATED_DINING_DATABASE)) {
    const cleanKey = key.replace(/_/g, ' ');
    if (norm.includes(cleanKey) || cleanKey.includes(norm)) {
      return dishes;
    }
  }

  // Alias lookups
  if (norm.includes('madras')) return CURATED_DINING_DATABASE['chennai'];
  if (norm.includes('kovai')) return CURATED_DINING_DATABASE['coimbatore'];
  if (norm.includes('tiruchirappalli') || norm.includes('trichy')) return CURATED_DINING_DATABASE['trichy'];
  if (norm.includes('tanjore')) return CURATED_DINING_DATABASE['thanjavur'];
  if (norm.includes('nilgiris') || norm.includes('udhagamandalam')) return CURATED_DINING_DATABASE['ooty'];
  if (norm.includes('kodai')) return CURATED_DINING_DATABASE['kodaikanal'];
  if (norm.includes('puducherry') || norm.includes('pondy')) return CURATED_DINING_DATABASE['pondicherry'];
  if (norm.includes('nellai')) return CURATED_DINING_DATABASE['tirunelveli'];
  if (norm.includes('bangalore')) return CURATED_DINING_DATABASE['bengaluru'];
  if (norm.includes('mysore')) return CURATED_DINING_DATABASE['mysuru'];
  if (norm.includes('munnar') || norm.includes('cochin')) return CURATED_DINING_DATABASE['kochi'];
  if (norm.includes('bombay')) return CURATED_DINING_DATABASE['mumbai'];
  if (norm.includes('new delhi')) return CURATED_DINING_DATABASE['delhi'];
  if (norm.includes('mewar') || norm.includes('city of lakes')) return CURATED_DINING_DATABASE['udaipur'];
  if (norm.includes('harmandir') || norm.includes('golden temple')) return CURATED_DINING_DATABASE['amritsar'];
  if (norm.includes('kashi') || norm.includes('benares')) return CURATED_DINING_DATABASE['varanasi'];
  if (norm.includes('manhattan') || norm.includes('brooklyn') || norm.includes('nyc')) return CURATED_DINING_DATABASE['new_york'];

  // Dynamic regional culinary generator for any other city in the world
  return [
    {
      dish: `${city} Signature Heritage Specialty`,
      description: `Authentic regional culinary recipe celebrated by local residents across ${city}, prepared using ancestral cooking methods and regional spices.`,
      bestTime: 'Traditional Lunch',
      recommendedPlaces: [
        `${city} Old Town Heritage Eatery`,
        `${city} Central Market Food Court`,
        `Famous Local Food Quarter of ${city}`
      ]
    },
    {
      dish: `${city} Morning Breakfast Artisan Plate`,
      description: `Freshly prepared morning delicacies crafted with local ingredients, warm breads or savories, and regional brew.`,
      bestTime: 'Morning Breakfast',
      recommendedPlaces: [
        `${city} Historic Bazaar Cafe`,
        `${city} Heritage Coffee & Breakfast Club`
      ]
    },
    {
      dish: `${city} Evening Street Delicacy & Sweet Treat`,
      description: `Beloved local street confection and evening savory delicacy enjoyed by residents in traditional market squares.`,
      bestTime: 'Evening & Dinner',
      recommendedPlaces: [
        `${city} Main Promenade Street Stalls`,
        `${city} Traditional Sweet & Dessert House`
      ]
    }
  ];
}
