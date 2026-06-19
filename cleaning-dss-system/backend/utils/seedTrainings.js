// backend/utils/seedTrainings.js
/**
 * Seed script: populate Training collection with the provided training materials.
 * Run: node utils/seedTrainings.js
 * 
 * This script inserts 60 training entries covering Kärcher, Nilfisk, Numatic,
 * and general best practices for cleaning equipment operation, maintenance,
 * chemical handling, and safety.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Training = require('../models/Training');

// All 60 training entries
const trainingsData = [
    {
        id: "TR001",
        title: "How to Set Up and Use a Kärcher Pressure Washer — Step by Step",
        brand: "Karcher",
        machine_category: "pressure_washer",
        machine_subtype: "electric_pressure_washer",
        applicable_models: ["K 2", "K 3", "K 4", "K 5 WCM", "K 7 WCM"],
        type: "article",
        url: "https://www.kaercher.com/au/home-garden/how-to-set-up-my-pressure-washer.html",
        description: "Official Kärcher step-by-step setup guide. Covers connecting the garden hose, unrolling the high-pressure hose without kinks, starting the machine, selecting the right nozzle, and correct storage after use.",
        key_topics: [
            "Connecting water supply to the machine",
            "Unrolling hose without twists or kinks",
            "Starting and stopping the machine safely",
            "Selecting correct nozzle tip per surface",
            "Storing the machine after use"
        ],
        best_practices: [
            "Always connect the water supply BEFORE switching the machine on — running dry damages the pump",
            "Keep the nozzle at least 30 cm from delicate surfaces like wood and painted panels",
            "Never point the jet at people, animals, or electrical installations",
            "Release trigger pressure before disconnecting hoses",
            "Drain water from the pump before storage in cold climates to prevent frost damage"
        ],
        intensity_level: "domestic_to_commercial",
        language: "English",
        free: true
    },
    {
        id: "TR002",
        title: "How Does a Pressure Washer Work — Inside the Kärcher K 7",
        brand: "Karcher",
        machine_category: "pressure_washer",
        machine_subtype: "electric_pressure_washer",
        applicable_models: ["K 7 WCM", "K 7 Comfort Premium", "HD series"],
        type: "article",
        url: "https://www.kaercher.com/int/inside-kaercher/difference-kaercher-magazine/kaercher-stories/how-does-a-pressure-washer-work.html",
        description: "Kärcher's in-depth explainer on the mechanics of a pressure washer — from motor to pump to nozzle. Explains water-cooled motor design, why pressure washers use far less water than a garden hose (400–600 L/hr vs 3,500 L/hr), and how the LED trigger gun works.",
        key_topics: [
            "How the electric motor drives the pump",
            "Water-cooling of the motor",
            "How pressure is generated",
            "Water saving compared to a garden hose",
            "LED trigger gun pressure selection"
        ],
        best_practices: [
            "Water-cooled motors (WCM) run quieter and last longer — preferred for daily commercial use",
            "Use the lowest effective pressure for the task — high pressure on delicate surfaces causes damage",
            "A pressure washer uses 6–8x less water than a garden hose for the same job"
        ],
        intensity_level: "commercial_to_industrial",
        language: "English",
        free: true
    },
    {
        id: "TR003",
        title: "Kärcher Pressure Washers — How To Guides Playlist",
        brand: "Karcher",
        machine_category: "pressure_washer",
        machine_subtype: "electric_pressure_washer",
        applicable_models: ["K 2", "K 3", "K 4", "K 5 WCM", "K 7 WCM"],
        type: "video",
        youtube_url: "https://www.youtube.com/playlist?list=PLA6jh0XU2XlQhWgbD9k2_67YduEfmucu8",
        description: "Official Kärcher UK YouTube playlist covering all pressure washer how-to guides — patios, cars, decking, garden furniture, and conservatories. Includes nozzle selection and detergent application tips.",
        key_topics: [
            "Cleaning patios and paving",
            "Washing cars and bikes",
            "Cleaning decking and garden furniture",
            "Selecting correct nozzle per task",
            "Applying detergent with the Plug 'n' Clean system"
        ],
        best_practices: [
            "Use the fan nozzle (25°) for large flat surfaces — faster coverage with less water",
            "Use the rotary nozzle (Dirt Blaster) for stubborn stains like oil on concrete",
            "Use the Plug 'n' Clean system for detergent — shake bottle gently before inserting",
            "Work top-to-bottom on vertical surfaces to let dirty water run away cleanly",
            "Wet the surface with detergent first, dwell 2–3 minutes, then rinse with clean water"
        ],
        intensity_level: "domestic_to_commercial",
        language: "English",
        free: true
    },
    {
        id: "TR004",
        title: "Kärcher HD Series — Professional Cold Water Pressure Washer Operation",
        brand: "Karcher",
        machine_category: "pressure_washer",
        machine_subtype: "electric_pressure_washer",
        applicable_models: ["HD 6/15 C", "HD 6/15 M", "HD 6/15 MXA Plus", "HD 13/35-4 SX Plus"],
        type: "article",
        url: "https://www.kaercher.com/int/professional/high-pressure-cleaners.html",
        description: "Kärcher professional HD series overview covering commercial and industrial cold-water pressure washers. Covers correct hose reel management, chemical injection, and safe operation on industrial sites.",
        key_topics: [
            "Chemical injection (downstream vs upstream dosing)",
            "Hose reel management on large sites",
            "Correct lance angle for heavy soiling",
            "Pressure regulation for different surfaces",
            "Triplex pump maintenance intervals"
        ],
        best_practices: [
            "For concrete degreasing, apply Kärcher RM 31 alkaline degreaser first and allow 5 minutes dwell time",
            "Always use the chemical injection port for detergents — never put chemical in the water supply tank",
            "Descale the machine every 3 months in hard-water areas using RM 25 descaler solution",
            "Replace high-pressure hose O-rings annually — cracked seals cause dangerous pressure loss",
            "Store with the lance removed and trigger locked to prevent accidental discharge"
        ],
        intensity_level: "commercial_to_industrial",
        language: "English",
        free: true
    },
    {
        id: "TR005",
        title: "Kärcher HDS Series — Hot Water Pressure Washer Operation and Maintenance",
        brand: "Karcher",
        machine_category: "pressure_washer",
        machine_subtype: "hot_water_pressure_washer",
        applicable_models: ["HDS 6/14 C", "HDS 6/15 C", "HDS 8/18 M", "HDS 12/18-4 S"],
        type: "article",
        url: "https://www.kaercher.com/int/professional/high-pressure-cleaners/hot-water-pressure-washers.html",
        description: "Hot water pressure washer operation guide for the Kärcher HDS series. Covers burner start-up, diesel fuel requirements, heating coil maintenance, winterising, and food-safe chemical use.",
        key_topics: [
            "Diesel burner start-up and shut-down sequence",
            "Temperature selection for different soils (60°C grease vs 80°C oil)",
            "Descaling the heating coil",
            "Winterising to prevent freeze damage",
            "Food-safe detergent (RM 735) application in food plants"
        ],
        best_practices: [
            "Hot water (60–80°C) removes grease and oil up to 3x faster than cold water alone — use it for kitchen and engine bays",
            "Always run the burner for at least 30 seconds after shutting off to purge condensation from the coil",
            "Use RM 735 food-grade alkaline cleaner in food processing areas — it is HACCP-compliant",
            "Descale the heating coil every 6 months in hard-water areas — scale reduces heating efficiency",
            "Never leave the machine idle with the burner on — it will overheat the coil within minutes"
        ],
        intensity_level: "industrial",
        language: "English",
        free: true
    },
    {
        id: "TR006",
        title: "BD 50/50 Scrubber Operation and Maintenance — Official Kärcher Video",
        brand: "Karcher",
        machine_category: "scrubber_dryer",
        machine_subtype: "walk_behind_scrubber_dryer",
        applicable_models: ["BD 50/50 C Classic Bp", "BD 50/55 C Classic Bp Pack", "BD 50/55 W Classic Bp Pack"],
        type: "video",
        youtube_url: "https://www.youtube.com/watch?v=T2AH8QtRXdc",
        description: "Official Kärcher video on how to operate and maintain the BD 50/50 walk-behind scrubber dryer. Covers filling the solution tank, setting brush pressure, the correct overlapping cleaning pattern, emptying and rinsing the recovery tank, and brush/squeegee maintenance.",
        key_topics: [
            "Filling the solution tank with correct detergent dilution",
            "Setting brush pressure for the floor type",
            "Correct figure-of-8 or lane cleaning pattern",
            "Emptying and cleaning the recovery tank daily",
            "Inspecting and replacing the squeegee blade"
        ],
        best_practices: [
            "Always dilute the detergent correctly in the solution tank — over-concentration causes excessive foam and clogs the recovery tank",
            "Use pH-neutral detergent (Kärcher RM 756) for daily maintenance on marble, vinyl, and wood floors",
            "Rinse and empty the recovery tank EVERY day — stagnant dirty water corrodes the tank",
            "Inspect the squeegee blade weekly — a worn blade leaves streaks and wet floors",
            "Charge the battery to 100% after every shift — never store it below 20% charge"
        ],
        intensity_level: "commercial",
        language: "English",
        free: true
    },
    {
        id: "TR007",
        title: "Kärcher B 50 W — Master Professional Floor Cleaning Step-by-Step",
        brand: "Karcher",
        machine_category: "scrubber_dryer",
        machine_subtype: "walk_behind_scrubber_dryer",
        applicable_models: ["B 50 W Push Scrubber"],
        type: "video",
        youtube_url: "https://www.youtube.com/watch?v=9dCpiZx0dZY",
        description: "Detailed tutorial for the Kärcher B 50 W industrial push scrubber. Covers the correct forward-and-back lane pattern for warehouse floors, handling red laterite soil, and post-shift maintenance.",
        key_topics: [
            "Lane cleaning pattern for large warehouse floors",
            "Handling red laterite soil and clay stains",
            "Selecting the correct brush type per floor",
            "Post-shift rinse cycle importance",
            "Battery management for multi-shift operations"
        ],
        best_practices: [
            "For red laterite soil (common in East Africa), pre-wet the floor first to loosen the clay before scrubbing",
            "Use Kärcher RM 755 Intensive Cleaner (pH 10.5) for periodic deep cleaning of embedded red soil",
            "Clean in overlapping lanes — each pass should overlap the previous by 5–10 cm to avoid missed strips",
            "For oily factory floors, use RM 69 alkaline cleaner at 1:50 dilution for routine and 1:20 for heavy soiling",
            "Empty and rinse recovery tank immediately after handling red soil — iron oxide in laterite accelerates corrosion"
        ],
        intensity_level: "industrial",
        language: "English",
        free: true
    },
    {
        id: "TR008",
        title: "Kärcher BD 50/50 C Bp Classic — Brilliant Floor Cleaning vs Mop and Bucket",
        brand: "Karcher",
        machine_category: "scrubber_dryer",
        machine_subtype: "walk_behind_scrubber_dryer",
        applicable_models: ["BD 50/50 C Classic Bp"],
        type: "video",
        youtube_url: "https://www.youtube.com/watch?v=qNA2r8ODbvg",
        description: "Demonstration video comparing the Kärcher BD 50/50 scrubber dryer against traditional mop-and-bucket cleaning. Shows the wet-floor safety risk from mopping, vs the dry-floor-in-seconds result from the scrubber dryer's built-in squeegee.",
        key_topics: [
            "Why scrubber dryers are safer than mops",
            "The squeegee recovery system explained",
            "Cleaning speed comparison with mopping",
            "Suitable floor types",
            "Battery operation in practice"
        ],
        best_practices: [
            "A scrubber dryer leaves floors dry in seconds, eliminating wet-floor slip hazards that are a common workplace injury risk",
            "Mops spread dirty water across the floor — a scrubber dryer applies clean solution and immediately recovers it",
            "One scrubber dryer operator cleans as much floor in 1 hour as 3 staff with mops and buckets",
            "In hospitals, hotels, and food facilities, scrubber dryers reduce cross-contamination compared to mop reuse"
        ],
        intensity_level: "commercial",
        language: "English",
        free: true
    },
    {
        id: "TR009",
        title: "Kärcher KIRA B 50 Robotic Scrubber — How to Deploy and Monitor",
        brand: "Karcher",
        machine_category: "scrubber_dryer",
        machine_subtype: "robotic_scrubber",
        applicable_models: ["KIRA B 50"],
        type: "article",
        url: "https://www.kaercher.com/int/professional/floor-care/scrubber-driers/battery-scrubber-driers/kira-b-50-battery-16906310.html",
        description: "Kärcher KIRA B 50 autonomous scrubber deployment guide. Covers site mapping, obstacle detection, cleaning route programming, solution tank filling, and performance monitoring via the KIRA Connect app.",
        key_topics: [
            "Initial site mapping and route programming",
            "No-go zone setup for obstructions",
            "KIRA Connect app monitoring",
            "Detergent dosing in autonomous mode",
            "Routine checks before each autonomous run"
        ],
        best_practices: [
            "Always do a manual supervised run before setting the robot to autonomous — confirm obstacle detection is working",
            "Use only low-foam detergents in robotic scrubbers — excessive foam triggers sensor faults",
            "Empty and rinse recovery tank before each autonomous session — full tanks trigger auto-stop",
            "Re-map the environment if furniture or shelving is moved — the robot will navigate around old map positions",
            "Keep floors clear of cables and hoses during autonomous runs — these are the most common cause of navigation errors"
        ],
        intensity_level: "commercial",
        language: "English",
        free: true
    },
    {
        id: "TR010",
        title: "Nilfisk SC250 — Use and Care of Your Micro Scrubber Dryer",
        brand: "Nilfisk",
        machine_category: "scrubber_dryer",
        machine_subtype: "micro_scrubber",
        applicable_models: ["SC250"],
        type: "video",
        youtube_url: "https://www.youtube.com/watch?v=Iw0DZihomlM",
        description: "Official Nilfisk training video for the SC250 micro scrubber dryer. Published by Nilfisk. Covers daily use, correct brush pressure setting, tank filling, squeegee angle adjustment, and end-of-shift maintenance.",
        key_topics: [
            "Filling solution and recovery tanks",
            "Brush pressure adjustment for hard floors",
            "Squeegee blade angle and replacement",
            "Cleaning narrow aisles and restrooms",
            "End-of-day maintenance checklist"
        ],
        best_practices: [
            "The SC250 is ideal for restrooms, corridors, and areas inaccessible to larger machines — use it daily",
            "Adjust squeegee blade to be flat on the floor — a tilted blade leaves water trails",
            "For restroom tile floors, use Nilfisk Floor Clean Neutral daily — avoid acidic cleaners near grout",
            "Clean the brush pad after every 8 hours of use — embedded grit scratches the floor surface",
            "Charge battery on the docking station overnight — never leave battery discharged for more than 24 hours"
        ],
        intensity_level: "commercial",
        language: "English",
        free: true
    },
    {
        id: "TR011",
        title: "Nilfisk SC400 Training Video — How to Operate the Scrubber Dryer",
        brand: "Nilfisk",
        machine_category: "scrubber_dryer",
        machine_subtype: "walk_behind_scrubber_dryer",
        applicable_models: ["SC400", "SC500"],
        type: "video",
        youtube_url: "https://www.youtube.com/watch?v=iYoqyhmFDm0",
        description: "Official Nilfisk SC400 operation training video. Covers machine controls, selecting cleaning mode, operating in forward and reverse, the eco-clean water saving mode, and daily maintenance.",
        key_topics: [
            "Machine controls overview",
            "Eco mode for water and chemical saving",
            "Forward and reverse cleaning",
            "Tank drainage and rinsing",
            "Brush and squeegee inspection"
        ],
        best_practices: [
            "Use eco-mode for daily light maintenance — it reduces water and chemical use by up to 30%",
            "Never leave dirty solution in the recovery tank — empty and rinse after every shift",
            "Use Nilfisk Floor Clean Neutral for vinyl, marble, and tile — it is pH neutral and safe for all hard floors",
            "Check the squeegee vacuum hose for blockages weekly — blocked hose causes wet trails",
            "If the machine leaves water on the floor, first check the squeegee blade before assuming a mechanical fault"
        ],
        intensity_level: "commercial",
        language: "English",
        free: true
    },
    {
        id: "TR012",
        title: "Nilfisk SC250 — How to Maintain Your Scrubber Dryer",
        brand: "Nilfisk",
        machine_category: "scrubber_dryer",
        machine_subtype: "micro_scrubber",
        applicable_models: ["SC250", "SC400"],
        type: "video",
        youtube_url: "https://www.youtube.com/watch?v=ZJQTz0Fmz5w",
        description: "Nilfisk maintenance training video focused on keeping the SC250 scrubber dryer in top condition. Covers weekly and monthly maintenance tasks, brush motor inspection, squeegee blade wear indicators, and battery maintenance.",
        key_topics: [
            "Daily maintenance checklist",
            "Weekly brush and squeegee inspection",
            "Monthly motor and battery check",
            "Cleaning the filter and debris screen",
            "Knowing when to replace brushes and blades"
        ],
        best_practices: [
            "Scrubber brushes should be replaced when worn below 15 mm height — worn brushes miss dirt and damage floors",
            "Squeegee blades should be rotated to a fresh edge every 2 weeks and replaced monthly under heavy use",
            "Clean the debris screen at the recovery tank inlet daily — a blocked screen causes motor overload",
            "Store the machine with the brush raised off the floor — parking on the brush flattens the bristles",
            "Every 6 months, have a qualified technician check the brush motor carbon brushes for wear"
        ],
        intensity_level: "commercial",
        language: "English",
        free: true
    },
    {
        id: "TR013",
        title: "Nilfisk BR855 Ride-On Scrubber — Use and Maintenance",
        brand: "Nilfisk",
        machine_category: "scrubber_dryer",
        machine_subtype: "rider_scrubber_dryer",
        applicable_models: ["BR855", "CR1200"],
        type: "video",
        youtube_url: "https://www.youtube.com/watch?v=bh9x4jwarow",
        description: "Nilfisk BR855 and BR855S ride-on scrubber training video. Covers pre-operation checks, operator seating and seat belt requirements, steering controls, brush deck lowering, solution flow management, and post-shift washdown.",
        key_topics: [
            "Pre-operation safety checks",
            "Seat belt and operator safety requirements",
            "Brush deck lowering and pressure control",
            "Side brush operation for edges",
            "Industrial post-shift washdown procedure"
        ],
        best_practices: [
            "Always perform a pre-shift walkthrough of the cleaning area to identify obstacles before mounting the machine",
            "On wet factory floors, reduce speed to 50% — the machine is heavy and hard to stop quickly on slippery surfaces",
            "Use the side brushes for edges and corners — the main brush deck does not reach walls",
            "Flush the solution system with clean water at end of shift to prevent detergent residue drying in the pipes",
            "Keep the on-board charger plugged in when not in use — these machines have large battery banks that self-discharge slowly"
        ],
        intensity_level: "industrial",
        language: "English",
        free: true
    },
    {
        id: "TR014",
        title: "Nilfisk SC6000 Ride-On Scrubber — How to Use and Maintain",
        brand: "Nilfisk",
        machine_category: "scrubber_dryer",
        machine_subtype: "rider_scrubber_dryer",
        applicable_models: ["SC6000"],
        type: "video",
        youtube_url: "https://m.youtube.com/watch?v=FU7TQ51nu6A",
        description: "Nilfisk SC6000 large ride-on scrubber operation and maintenance tutorial. Covers onboard diagnostics, tank capacity management for large warehouse runs, brush deck maintenance, and traction drive maintenance.",
        key_topics: [
            "Onboard diagnostics and fault codes",
            "Solution flow rate management",
            "Brush deck maintenance and replacement",
            "Traction motor and drive belt checks",
            "End-of-shift complete washdown"
        ],
        best_practices: [
            "The SC6000 covers up to 6,000 m² per hour — plan your cleaning route before starting to avoid dead-end situations",
            "Always check battery charge before a long warehouse run — running out mid-floor leaves dirty solution sitting on the floor",
            "Clean the recovery tank with a pressure washer weekly — built-up sediment reduces tank capacity significantly",
            "Use Nilfisk Floor Clean Alkaline for periodic deep cleaning of heavily soiled warehouse concrete",
            "Log all fault codes reported on the display — they help technicians diagnose issues faster"
        ],
        intensity_level: "industrial",
        language: "English",
        free: true
    },
    {
        id: "TR015",
        title: "Numatic TT1840 Walk-Behind Scrubber Dryer — Operation Guide",
        brand: "Numatic",
        machine_category: "scrubber_dryer",
        machine_subtype: "walk_behind_scrubber_dryer",
        applicable_models: ["TT1840", "TTB1840NX-R", "440NX"],
        type: "article",
        url: "https://numatic.com/our-products/",
        description: "Numatic TT1840 and TTB1840 cordless scrubber operation guide from the Numatic product range. Covers the NX1K battery system, TwinFlo motor technology, correct brush pad selection per floor type, and the squeegee recovery system.",
        key_topics: [
            "NX1K battery system and runtime",
            "TwinFlo motor — brush plus vacuum in one",
            "Selecting the correct brush pad",
            "Operating on vinyl, tile, and marble",
            "Daily rinse and maintenance routine"
        ],
        best_practices: [
            "The NX1K battery packs are hot-swappable — carry a spare for continuous multi-shift operation",
            "Use a white or red pad for maintenance cleaning; use a black or brown pad only for stripping old floor polish",
            "Numatic NuScrub LFG is a low-foam food-grade detergent — suitable for Numatic machines in kitchens and food areas",
            "The TwinFlo motor combines brush action and suction — never obstruct the suction inlet or the motor overloads",
            "After cleaning, park the machine with the brush raised — store brush pads flat and dry to prevent mould growth"
        ],
        intensity_level: "commercial",
        language: "English",
        free: true
    },
    {
        id: "TR016",
        title: "HOW TO USE Numatic Henry NVR 200 Vacuum Cleaner",
        brand: "Numatic",
        machine_category: "vacuum_cleaner",
        machine_subtype: "industrial_vacuum",
        applicable_models: ["Henry HVR200", "Henry Micro HVR200M"],
        type: "video",
        youtube_url: "https://www.youtube.com/watch?v=tQJem3bO_iA",
        description: "Practical how-to guide for the Numatic Henry NVR 200 commercial vacuum cleaner. Covers assembling the hose and tools, the HepaFlo dust bag system, correct technique for carpets vs hard floors, and emptying and storing the machine.",
        key_topics: [
            "Assembling hose, wand, and floor tool",
            "Loading and changing HepaFlo dust bags",
            "Carpet vs hard floor technique",
            "Cleaning the motor filter",
            "Safe storage and cable management"
        ],
        best_practices: [
            "Always use Numatic HepaFlo bags — using generic bags allows fine dust to bypass the motor filter",
            "Change the bag when it is 2/3 full — a full bag restricts airflow and reduces suction power",
            "For hard floors, use the smooth floor tool (not the carpet head) to avoid scattering debris",
            "Clean or replace the motor filter every 3 months — blocked filters overheat the motor",
            "Never vacuum up plaster dust, fine cement, or toxic materials without a HEPA filter upgrade"
        ],
        intensity_level: "commercial",
        language: "English",
        free: true
    },
    {
        id: "TR017",
        title: "Numatic Henry HVR160 Quick Start Guide",
        brand: "Numatic",
        machine_category: "vacuum_cleaner",
        machine_subtype: "industrial_vacuum",
        applicable_models: ["Henry HVR200", "Henry Micro HVR200M"],
        type: "video",
        youtube_url: "https://www.youtube.com/watch?v=W8EuFSyCcXQ",
        description: "Quick start video for the Numatic Henry vacuum cleaner. Ideal for new operators. Covers out-of-box assembly, tool selection, switching between carpet and hard floor modes, and first-use tips.",
        key_topics: [
            "Out-of-box assembly",
            "Connecting the hose and wand",
            "Choosing tools for different surfaces",
            "Using the cable rewind safely",
            "First-use and break-in checklist"
        ],
        best_practices: [
            "Do not pull the machine by the hose — always carry it by the handle to protect the inlet connection",
            "Wrap the hose around the machine body when transporting — a loose hose is a trip hazard",
            "For staircase cleaning, work top to bottom — vacuum each step before moving to the next",
            "Never run the machine without a bag installed — this sends dust directly into the motor"
        ],
        intensity_level: "commercial",
        language: "English",
        free: true
    },
    {
        id: "TR018",
        title: "Maintaining Your Numatic Vacuum Cleaner — Henry and NVR200",
        brand: "Numatic",
        machine_category: "vacuum_cleaner",
        machine_subtype: "industrial_vacuum",
        applicable_models: ["Henry HVR200", "George GVE370", "Harry HHR200"],
        type: "video",
        youtube_url: "https://m.youtube.com/watch?v=ztAzwSxTglc",
        description: "Maintenance guide for Numatic TwinFlo motor vacuum cleaners. Covers the HepaFlo bag system, motor filter cleaning intervals, hose crack inspection, tool clip servicing, and when to service the TwinFlo motor.",
        key_topics: [
            "HepaFlo bag system — how it works",
            "Motor filter cleaning and replacement",
            "Hose integrity check — cracks lose suction",
            "Tool clip wear and replacement",
            "When to call a service technician"
        ],
        best_practices: [
            "Check the entire hose length for cracks every month — even a small crack halves suction efficiency",
            "The TwinFlo motor is designed to be serviced — carbon brushes last about 1,000 hours and are replaceable",
            "Clean the 3-stage HEPA filter by tapping gently over a bin — never wash the dry filter with water",
            "Store in a cool dry place — Numatic machines are corrosion-resistant but prolonged dampness damages the motor windings"
        ],
        intensity_level: "commercial",
        language: "English",
        free: true
    },
    {
        id: "TR019",
        title: "Numatic NTD750 Industrial Wet and Dry Vacuum — Operation",
        brand: "Numatic",
        machine_category: "vacuum_cleaner",
        machine_subtype: "wet_dry",
        applicable_models: ["NTD750", "WVD570", "NDD900"],
        type: "article",
        url: "https://numatic.com/our-products/",
        description: "Numatic industrial wet-and-dry vacuum operation guide for the NTD750 and similar large-capacity drum machines. Covers wet mode vs dry mode switching, the float cut-off system, emptying the drum, HEPA filter maintenance for hazardous dust.",
        key_topics: [
            "Switching between wet and dry mode",
            "Float cut-off — prevents motor damage when tank is full",
            "Draining and emptying the drum",
            "HEPA filter for hazardous dust",
            "Foam suppressor for wet pickup"
        ],
        best_practices: [
            "In wet mode, the float cut-off automatically stops suction when the tank is full — do not override this safety feature",
            "Never vacuum flammable liquids (petrol, solvents) — use only wet-rated machines in flameproof environments",
            "For dusty sites, use a HEPA filter capsule — standard foam filters allow fine dust to recirculate",
            "Drain the drum through the drain plug after wet pickup — tilting the drum to empty spills contaminants",
            "In industrial environments, empty and clean the drum at least twice per shift to maintain suction performance"
        ],
        intensity_level: "industrial",
        language: "English",
        free: true
    },
    {
        id: "TR020",
        title: "Kärcher IVC Industrial Vacuum — HEPA H-Class Hazardous Dust Operation",
        brand: "Karcher",
        machine_category: "vacuum_cleaner",
        machine_subtype: "industrial_vacuum",
        applicable_models: ["IVC 60/24-2 Tact²", "IVC 60/30 Tact² Ec H", "IVC 30/12-1 Tact² M Bp"],
        type: "article",
        url: "https://www.kaercher.com/int/professional/vacuum-cleaners/industrial-vacuum-cleaners.html",
        description: "Kärcher industrial vacuum cleaner guide for the IVC series with Tact² automatic filter cleaning. Covers H-class HEPA certification for asbestos and silica dust, Tact² self-cleaning operation, filter integrity testing, and safe bag disposal.",
        key_topics: [
            "H-class vs M-class certification — when each is needed",
            "Tact² automatic filter cleaning during operation",
            "Correct bag insertion and sealing for hazardous dust",
            "Safe bag removal and disposal",
            "Filter integrity testing procedure"
        ],
        best_practices: [
            "H-class (HEPA H14) is mandatory for asbestos, silica dust, and carcinogenic materials — do not use M-class for these",
            "The Tact² system pulses the filter clean every few seconds during operation — this maintains suction without stopping work",
            "Always change bags BEFORE they are full in hazardous environments — overfull bags risk rupture during removal",
            "When changing hazardous dust bags, wear gloves and an FFP3 mask — never shake the bag",
            "Check the filter for damage before every use — a torn filter on H-class work invalidates the safety protection"
        ],
        intensity_level: "industrial",
        language: "English",
        free: true
    },
    {
        id: "TR021",
        title: "Nilfisk Attix 44 Wet and Dry Vacuum — Operation and Maintenance",
        brand: "Nilfisk",
        machine_category: "vacuum_cleaner",
        machine_subtype: "wet_dry",
        applicable_models: ["Attix 44 Wet & Dry", "IVB7"],
        type: "article",
        url: "https://www.nilfisk.com/global/consumer/",
        description: "Nilfisk Attix 44 operation guide covering wet-and-dry mode switching, the Tact self-cleaning filter system, stainless steel drum maintenance, and accessory selection for different commercial tasks.",
        key_topics: [
            "Wet and dry mode configuration",
            "Tact self-cleaning filter system",
            "Stainless steel drum care",
            "Accessory selection — floor nozzles vs crevice tools",
            "Maintenance schedule for commercial use"
        ],
        best_practices: [
            "Use the Tact filter cleaning system before switching from wet to dry mode — this prevents soggy dust blocking the filter",
            "Rinse the stainless steel drum with clean water after wet pickup — dried residue is harder to remove",
            "For fine dust pickup, fit the exhaust filter sock before operation — it traps particles the main filter misses",
            "Clean the inlet port weekly — this is where wet debris accumulates and causes odour",
            "Do not vacuum hot ashes or embers — they melt the filter and can start a fire inside the tank"
        ],
        intensity_level: "commercial",
        language: "English",
        free: true
    },
    {
        id: "TR022",
        title: "Kärcher SC 4 and SC 5 Steam Cleaner — User Guide and Best Practices",
        brand: "Karcher",
        machine_category: "steam_cleaner",
        machine_subtype: "portable_steam_cleaner",
        applicable_models: ["SC 2 Deluxe EasyFix", "SC 4 Premium", "SC 5 EasyFix"],
        type: "article",
        url: "https://manuals.plus/karcher/sc-4-easyfix-steam-cleaner-manual",
        description: "Kärcher SC 4 and SC 5 EasyFix steam cleaner operation guide. Covers safe boiler filling, steam level selection, cleaning different surfaces, the descaling cycle, and the EasyFix accessory-change system.",
        key_topics: [
            "Safe boiler filling — tap water vs distilled water",
            "Steam level selection for different surfaces",
            "Cleaning tiles, glass, grout, and stainless steel",
            "Descaling the boiler every 200 hours",
            "EasyFix quick-release accessories"
        ],
        best_practices: [
            "Use tap water or a mix of up to 50% distilled water — pure distilled water damages the boiler's anti-scale elements",
            "Never open the boiler cap while the machine is hot — depressurise by running steam for 30 seconds first",
            "Steam alone kills 99.9% of bacteria and viruses — no detergent needed for disinfection tasks",
            "For grout lines, use the small round brush accessory with the steam gun — it loosens embedded dirt without chemicals",
            "Descale every 200 operating hours using Kärcher descaler sticks — scale reduces steam output and damages the boiler",
            "Do not use on delicate lacquered furniture, painted surfaces, silk, or unsealed wood"
        ],
        intensity_level: "domestic_to_commercial",
        language: "English",
        free: true
    },
    {
        id: "TR023",
        title: "Kärcher SG 4/4 Professional Steam Generator — Food Grade Applications",
        brand: "Karcher",
        machine_category: "steam_cleaner",
        machine_subtype: "continuous_fill_steam_cleaner",
        applicable_models: ["SG 4/4 Professional"],
        type: "article",
        url: "https://www.kaercher.com/int/professional/steam-cleaners/steam-generators.html",
        description: "Kärcher SG 4/4 continuous steam generator operation guide for commercial and food-grade applications. Covers the continuous-fill water tank system that eliminates downtime for refilling, HACCP compliance, and safe steam pressure management.",
        key_topics: [
            "Continuous-fill operation — no downtime for refilling",
            "HACCP-compliant food-area sanitisation",
            "Steam pressure management",
            "Stainless steel surface cleaning technique",
            "Grease and food residue removal without chemicals"
        ],
        best_practices: [
            "The SG 4/4 produces dry steam at 4+ bar — this temperature destroys Salmonella, E. coli, and Listeria on contact",
            "In food factories, steam cleaning replaces chemicals for surface sanitisation — safer for workers and no chemical residue",
            "Always move the steam nozzle in slow, overlapping strokes — rapid movement leaves some areas un-sanitised",
            "For tile grout in kitchens, use the detail brush accessory — it reaches into grout channels where chemicals do not penetrate",
            "Allow steam-cleaned stainless steel surfaces to dry completely before food contact — condensed steam is safe but wet surfaces attract dust"
        ],
        intensity_level: "industrial",
        language: "English",
        free: true
    },
    {
        id: "TR024",
        title: "Kärcher Puzzi Carpet Extractor — How to Use for Commercial Carpet Cleaning",
        brand: "Karcher",
        machine_category: "carpet_cleaner",
        machine_subtype: "walk_behind_extractor",
        applicable_models: ["Puzzi 8/1 C", "Puzzi 10/1", "Puzzi 30/4"],
        type: "article",
        url: "https://www.kaercher.com/int/professional/carpet-care/carpet-cleaners.html",
        description: "Kärcher Puzzi series operation guide for commercial carpet extraction cleaning. Covers pre-treatment with iCapsol RM 48, correct spray-and-extract technique, drying time management, and upholstery cleaning with the hand tool.",
        key_topics: [
            "Pre-treating heavy stains before extraction",
            "iCapsol encapsulation technology",
            "Spray-and-extract technique",
            "Drying time and ventilation",
            "Upholstery cleaning with hand tool"
        ],
        best_practices: [
            "Pre-treat stubborn stains with Kärcher RM 48 iCapsol spray — allow 5 minutes dwell time before extraction",
            "Work in the direction of the carpet pile — extracting against the pile lifts soil better but can mat fibres if repeated",
            "Make one wet pass (spray + extract) then one dry pass (extract only) — double pass removes 30% more moisture",
            "Ventilate the room during drying — a carpet left wet for more than 6 hours risks mould growth in the backing",
            "For red laterite soil in carpet, apply iCapsol cleaner and allow 10 minutes before extraction — iron in the soil bonds tightly to carpet fibres",
            "Never over-wet the carpet — excess moisture damages carpet backing and promotes mould"
        ],
        intensity_level: "commercial",
        language: "English",
        free: true
    },
    {
        id: "TR025",
        title: "Numatic George GVE370 — Wet, Dry, and Carpet Cleaning in One Machine",
        brand: "Numatic",
        machine_category: "vacuum_cleaner",
        machine_subtype: "wet_dry",
        applicable_models: ["George GVE370", "Harry HHR200"],
        type: "video",
        youtube_url: "https://www.youtube.com/watch?v=1_9CuAw7QdY",
        description: "Numatic George GVE370 demonstration video showing wet pickup, dry vacuuming, and carpet shampooing in one machine. Covers switching between modes, loading carpet shampoo, the spray-and-brush agitation head, and recovery tank draining.",
        key_topics: [
            "Switching between dry, wet, and shampoo modes",
            "Loading Numatic NuMatt carpet detergent",
            "Carpet agitation brush technique",
            "Spray-and-recover method for stairs and upholstery",
            "Post-use recovery tank cleaning"
        ],
        best_practices: [
            "The George is a 3-in-1 machine — ideal for small commercial spaces where budget does not allow separate wet and dry machines",
            "For carpet shampooing, use Numatic NuMatt at 1:10 dilution — stronger concentration does not clean better and leaves sticky residue",
            "Make multiple light passes rather than one heavy wet pass — carpets dry faster with less moisture",
            "After shampooing, do a final extraction-only pass to recover as much solution as possible",
            "Rinse the shampoo tank and suction tank separately after carpet cleaning — contamination between tanks causes odour"
        ],
        intensity_level: "commercial",
        language: "English",
        free: true
    },
    {
        id: "TR026",
        title: "Kärcher KM 70/30 C Battery Sweeper — Operation and Maintenance",
        brand: "Karcher",
        machine_category: "sweeper",
        machine_subtype: "walk_behind_sweeper",
        applicable_models: ["KM 70/30 C Bp Pack", "KM 70/30 C Bp Plus", "KM 85/50 W Bp Pack"],
        type: "article",
        url: "https://www.kaercher.com/int/professional/sweepers/walk-behind-sweepers.html",
        description: "Kärcher KM 70/30 battery sweeper operation guide. Covers adjusting side and main brush height for different debris sizes, the dust-controlled sweeping system, emptying the debris tray without raising dust, and brush wear indicators.",
        key_topics: [
            "Main and side brush height adjustment",
            "Dust-controlled sweeping — filter system",
            "Empty debris tray without dust clouds",
            "Battery runtime management",
            "Brush height wear indicators"
        ],
        best_practices: [
            "Adjust brush height so bristles just touch the floor — brushes set too low wear 3x faster and use more battery",
            "Sweep at a steady walking pace — rushing reduces dust containment and leaves debris behind",
            "Empty the debris tray before it is completely full — over-filling causes debris to bypass the filter and block the sweeping chamber",
            "In dusty environments, clean the filter after every emptying — blocked filters reduce dust containment",
            "Dampen extremely dusty floors lightly before sweeping — this prevents fine dust becoming airborne"
        ],
        intensity_level: "commercial",
        language: "English",
        free: true
    },
    {
        id: "TR027",
        title: "Nilfisk SR1900 Ride-On Sweeper — Operation Guide",
        brand: "Nilfisk",
        machine_category: "sweeper",
        machine_subtype: "rider_sweeper",
        applicable_models: ["SR1900", "SW5000", "SW5500"],
        type: "article",
        url: "https://www.nilfisk.com/global/consumer/",
        description: "Nilfisk ride-on sweeper operation guide covering large indoor and outdoor sweeping. Covers pre-operation checklist, brush deck lowering, the high-dump hopper system, side brush management, and end-of-shift filter shake-down.",
        key_topics: [
            "Pre-operation safety walk-around",
            "Brush deck lowering for different surfaces",
            "High-dump hopper emptying cycle",
            "Side brushes for wall edges",
            "End-of-shift filter shake-down"
        ],
        best_practices: [
            "Check tyre pressure before each shift — correct pressure is critical for stability on uneven warehouse floors",
            "Empty the hopper before it reaches maximum capacity — overfilling causes debris to pack the filter chamber",
            "Use the side brushes for the first pass along walls, then follow with the main brush — this collects edge debris efficiently",
            "For outdoor sweeping of large car parks, work in overlapping rows of 60 cm to ensure complete coverage",
            "Run the filter shake-down cycle at the end of every shift to dislodge dust from the filter media"
        ],
        intensity_level: "industrial",
        language: "English",
        free: true
    },
    {
        id: "TR028",
        title: "Kärcher WV 6 Plus Window Vacuum — How to Streak-Free Clean Glass",
        brand: "Karcher",
        machine_category: "window_cleaner",
        machine_subtype: "robotic_window_cleaner",
        applicable_models: ["WV 6 Plus", "WVP 10 Adv", "WVC 2"],
        type: "article",
        url: "https://www.kaercher.com/uk/home-garden/how-to-guides/pressure-washers/how-to-use-a-pressure-washer.html",
        description: "Kärcher window vacuum technique guide for streak-free glass cleaning. Covers applying the correct amount of glass cleaner with a microfibre pad, the overlapping squeegee stroke technique, and emptying the water collection tank.",
        key_topics: [
            "Applying glass cleaning solution evenly",
            "Overlapping squeegee stroke for no streaks",
            "Emptying the collection tank",
            "Cleaning the rubber squeegee blade",
            "Using on different glass types including mirrors and shower screens"
        ],
        best_practices: [
            "Apply glass cleaning solution with the microfibre pad first — the suction head alone without pre-wetting leaves residue",
            "Work in overlapping horizontal strokes from top to bottom — vertical strokes leave more drips",
            "Empty the collection tank before it becomes full — a full tank creates backpressure and the rubber blade starts to leak",
            "Clean the rubber blade after every window — a dirty blade drags residue across the glass",
            "For very large windows, divide into zones and clean each zone from top to bottom"
        ],
        intensity_level: "domestic_to_commercial",
        language: "English",
        free: true
    },
    {
        id: "TR029",
        title: "Understanding pH in Cleaning Chemicals — A Practical Guide for Operators",
        brand: "General",
        machine_category: "detergents_and_chemicals",
        machine_subtype: null,
        applicable_models: ["all"],
        type: "article",
        url: "https://unilever-professional.com/blogs/upro-knowledge-hub/floor-cleaning-chemicals-type",
        description: "Practical guide to the pH scale for cleaning professionals. Explains why pH matters for both cleaning effectiveness and surface safety. Covers when to use acidic vs alkaline vs neutral cleaners, and how pH interacts with different floor and surface types.",
        key_topics: [
            "The pH scale — acids, neutral, and alkalis",
            "Why alkaline cleaners remove grease and oil",
            "Why acidic cleaners remove lime scale and rust",
            "pH-neutral cleaners for daily maintenance on sensitive floors",
            "Risk of using wrong pH on marble, aluminium, and chrome"
        ],
        best_practices: [
            "pH 0–4 (acidic): removes lime scale, rust, and mineral deposits. Use on tile grout, stainless steel, and ceramic. Never use on marble, natural stone, or aluminium — acid dissolves the surface",
            "pH 5–8 (neutral): daily maintenance on all floor types including marble, wood, vinyl, and carpet. Safe to use daily",
            "pH 9–12 (alkaline): removes grease, oil, and organic soil. Use on concrete, tile, and stainless steel. Dilute correctly — high alkalinity damages aluminium and anodised surfaces",
            "pH 12+ (caustic): industrial degreasers for very heavy soil. Always wear PPE — gloves, goggles, and apron. Neutralise rinse water before disposal",
            "Match the cleaner pH to the soil type — not to the floor type. The soil needs removing, not the floor surface"
        ],
        intensity_level: "all",
        language: "English",
        free: true
    },
    {
        id: "TR030",
        title: "Detergent Dilution Ratios — How to Mix Cleaning Chemicals Correctly",
        brand: "General",
        machine_category: "detergents_and_chemicals",
        machine_subtype: null,
        applicable_models: ["all"],
        type: "article",
        url: "https://www.sudochementerprises.com/post/understanding-dilution-ratios-a-simple-guide-for-professional-cleaners",
        description: "Practical guide to understanding and applying cleaning chemical dilution ratios. Explains what 1:50, 1:100, and 1:200 mean in practice, how to measure accurately without equipment, and the cost and safety implications of over- or under-diluting.",
        key_topics: [
            "What dilution ratios mean in practice",
            "Measuring without specialist equipment",
            "Universal dilution reference chart",
            "Cost impact of over-diluting",
            "Safety risk of under-diluting"
        ],
        best_practices: [
            "1:10 means 1 part chemical to 10 parts water. For a 5-litre bucket: add 455 mL chemical, top up to 5 litres with water",
            "1:50 means 1 part chemical to 50 parts water. For a 5-litre bucket: add 98 mL chemical, top up to 5 litres",
            "1:100 means 1 part chemical to 100 parts water. For a 5-litre bucket: add 50 mL chemical",
            "Always add chemical to water, not water to chemical — this prevents splashing of concentrated product",
            "Using stronger solution than recommended wastes chemical, leaves sticky residue, and can damage floor surfaces",
            "Using weaker solution than recommended means dirt is not removed — the floor looks clean but bacteria remain",
            "Label all diluted solutions clearly with the chemical name, dilution ratio, and date mixed"
        ],
        intensity_level: "all",
        language: "English",
        free: true
    },
    {
        id: "TR031",
        title: "Kärcher RM Detergent Range — Which Chemical for Which Task",
        brand: "Karcher",
        machine_category: "detergents_and_chemicals",
        machine_subtype: null,
        applicable_models: ["all_karcher_machines"],
        type: "article",
        url: "https://www.kaercher.com/int/professional/cleaning-and-care-products/professional.html",
        description: "Kärcher professional RM detergent selection guide. Covers the entire RM range from RM 25 (acid descaler) through RM 69 (industrial floor cleaner) to RM 755/756 (floor care) and RM 735 (food-grade). Helps operators select the right product for the task.",
        key_topics: [
            "RM 25 — acid descaler for HDS machines and boilers",
            "RM 31 — heavy-duty oil and grease remover",
            "RM 55 — neutral all-purpose pressure washer cleaner",
            "RM 69 — industrial alkaline floor cleaner for scrubber dryers",
            "RM 756 — pH neutral daily floor care cleaner",
            "RM 735 — food-grade alkaline cleaner (HACCP)",
            "RM 48 — iCapsol carpet encapsulation cleaner"
        ],
        best_practices: [
            "RM 55 (pH 7): use for everyday pressure washing of facades, vehicles, and patios where surface protection is important",
            "RM 31 (pH 13): use for heavy grease and oil on engines, workshop floors, and loading bays — always dilute at 1:5 to 1:20",
            "RM 69 (pH 12): use in scrubber dryers for factory and warehouse floors with heavy soiling",
            "RM 756 (pH 7.5): daily scrubber-dryer detergent for offices, hotels, hospitals, and schools on all floor types",
            "RM 735 (food-grade): mandatory for food processing, kitchens, and food contact surface cleaning",
            "RM 48 iCapsol: encapsulates carpet soil in crystals that are vacuumed up after drying — reduces drying time vs wet extraction",
            "Never mix different RM products in the same tank — chemical incompatibility can cause dangerous reactions"
        ],
        intensity_level: "commercial_to_industrial",
        language: "English",
        free: true
    },
    {
        id: "TR032",
        title: "Nilfisk Floor Clean — Daily Floor Maintenance with Scrubber Dryers",
        brand: "Nilfisk",
        machine_category: "detergents_and_chemicals",
        machine_subtype: null,
        applicable_models: ["SC250", "SC400", "SC500", "SC800", "BR855", "CR1200"],
        type: "article",
        url: "https://www.nilfisk.com/global/consumer/",
        description: "Nilfisk floor cleaning chemical guide for daily and periodic scrubber-dryer use. Covers the Floor Clean Neutral (pH 7) for daily maintenance, Floor Clean Alkaline (pH 11) for periodic deep cleaning, and the Floor Protect anti-slip polish.",
        key_topics: [
            "Floor Clean Neutral — daily maintenance on all floors",
            "Floor Clean Alkaline — periodic deep cleaning",
            "Floor Protect — anti-slip floor polish after cleaning",
            "Correct dosing for scrubber dryer solution tanks",
            "Switching between daily and periodic chemicals"
        ],
        best_practices: [
            "For daily maintenance: use Floor Clean Neutral at 1:100 to 1:300 in the scrubber dryer solution tank",
            "For weekly deep cleaning: use Floor Clean Alkaline at 1:20 to 1:50 — always rinse the floor with a second pass of clean water after alkaline cleaning",
            "After stripping and deep cleaning, apply Floor Protect anti-slip polish — it extends the floor's life and reduces slip risk on wet floors",
            "Always measure detergent precisely — scrubber dryers are calibrated for low-foam, low-concentration solutions. Over-dosing causes foam overflow from the recovery tank",
            "If you see foam appearing from the recovery tank air vent, immediately reduce detergent concentration"
        ],
        intensity_level: "commercial_to_industrial",
        language: "English",
        free: true
    },
    {
        id: "TR033",
        title: "Numatic NuChem Cleaning Chemicals — Product Selection Guide",
        brand: "Numatic",
        machine_category: "detergents_and_chemicals",
        machine_subtype: null,
        applicable_models: ["all_numatic_machines"],
        type: "article",
        url: "https://numatic.com/our-products/",
        description: "Numatic NuChem chemical range guide covering NuScrub LFG (floor scrubber detergent), NuGen (degreaser), NuBac (disinfectant), NuMatt (carpet cleaner), and GR5 (water-based degreaser). Includes application guidance for each product and correct dilution for Numatic machines.",
        key_topics: [
            "NuScrub LFG — low-foam food-grade floor detergent",
            "NuGen — universal water-based degreaser",
            "NuBac — QAC disinfectant cleaner",
            "NuMatt — carpet and upholstery cleaner",
            "GR5 — eco-friendly industrial degreaser"
        ],
        best_practices: [
            "NuScrub LFG at 1:100 to 1:300 in scrubber dryer tanks — food-grade certified safe for canteens, kitchens, and food prep areas",
            "NuGen at 1:10 for heavy degreasing, 1:50 for routine cleaning — anti-bacterial and biodegradable",
            "NuBac at 1:100 to 1:400 in scrubber dryers — QAC disinfection valid for 10 minutes contact time on hard surfaces",
            "NuMatt at 1:10 to 1:40 in carpet extraction machines — low foam prevents foam overflow in George and WFF machines",
            "GR5 is non-toxic and non-carcinogenic — safe for operatives without PPE for routine degreasing tasks",
            "Never mix NuBac disinfectant with alkaline cleaners — the QAC is deactivated by high pH, reducing disinfection efficacy"
        ],
        intensity_level: "commercial_to_industrial",
        language: "English",
        free: true
    },
    {
        id: "TR034",
        title: "Surface Compatibility Guide — Which Cleaner is Safe on Which Floor",
        brand: "General",
        machine_category: "detergents_and_chemicals",
        machine_subtype: null,
        applicable_models: ["all"],
        type: "article",
        url: "https://unilever-professional.com/blogs/upro-knowledge-hub/floor-cleaning-chemicals-type",
        description: "Comprehensive surface-to-cleaner compatibility reference. Covers tile, concrete, vinyl, wood, marble, carpet, glass, and stainless steel. For each surface: which cleaners to use, which to avoid, and the correct technique.",
        key_topics: [
            "Tile and grout — neutral to mildly alkaline cleaners",
            "Concrete — heavy alkaline and acidic descalers",
            "Vinyl — pH-neutral only, no solvents",
            "Wood — pH-neutral, minimal moisture",
            "Marble and natural stone — pH-neutral ONLY, no acid ever",
            "Carpet — low-foam extraction or encapsulation cleaners",
            "Stainless steel — neutral to mildly alkaline, no chlorine bleach"
        ],
        best_practices: [
            "MARBLE: Never use acidic cleaners (pH below 6) — acid dissolves the calcium carbonate surface, leaving permanent dull patches. Use pH-neutral cleaner only",
            "VINYL: Never use solvent-based cleaners — solvents dissolve the PVC plasticiser, making the floor brittle and discoloured",
            "WOOD: Use minimal water — saturated wood floors warp and swell. Use a barely-damp mop with pH-neutral cleaner",
            "CONCRETE: Periodic acid wash (pH 2–3) removes lime scale and efflorescence. Follow with alkaline degreaser for oil and grease",
            "STAINLESS STEEL: Never use chlorine bleach — chlorine causes pitting corrosion on stainless steel. Use pH-neutral or mildly alkaline cleaner",
            "CARPET: Test any cleaner on a hidden area first — dyes in cheap carpets can bleed with alkaline cleaners",
            "GLASS: Never use abrasive cleaners — use glass-specific neutral cleaner with a squeegee or window vac"
        ],
        intensity_level: "all",
        language: "English",
        free: true
    },
    {
        id: "TR035",
        title: "Red Laterite Soil — Cleaning Strategies for East African Environments",
        brand: "General",
        machine_category: "best_practices",
        machine_subtype: null,
        applicable_models: ["all"],
        type: "article",
        url: "https://insights.regencysupply.com/cleaner-dilution-rates",
        description: "Practical cleaning guide for Uganda and East Africa's red laterite soil — one of the most challenging soils for cleaning machines. Covers why laterite is harder to remove than typical soil, pre-treatment strategies, correct chemical selection, and protecting machine components from iron oxide.",
        key_topics: [
            "Why red laterite soil is harder to remove than typical soil",
            "Iron oxide and its effect on machine components",
            "Pre-treatment and dwell time strategies",
            "Best chemicals for laterite soil on concrete and tile",
            "Protecting scrubber brushes and machine tanks from rust"
        ],
        best_practices: [
            "Red laterite contains iron oxide (rust) that bonds tightly to floor surfaces — standard neutral cleaners are insufficient. Use alkaline cleaners (pH 9–11) for effective removal",
            "Pre-wet laterite-soiled floors with warm water and allow 3–5 minutes dwell time before scrubbing — dry laterite is much harder to remove",
            "For heavily stained concrete: apply diluted acidic cleaner (1:10 ratio) to dissolve iron oxide staining, then rinse with alkaline cleaner, then rinse with clean water",
            "In rural Uganda where laterite soil is tracked in daily, schedule daily scrubbing with alkaline cleaner to prevent soil bonding to the floor surface",
            "Iron oxide from laterite accelerates rust inside machine recovery tanks — rinse tanks thoroughly after every use and inspect monthly for corrosion",
            "For carpet contaminated with red soil, allow to dry completely first — vacuuming dry laterite removes 60% more than vacuuming wet soil"
        ],
        intensity_level: "all",
        language: "English",
        free: true
    },
    {
        id: "TR036",
        title: "Cleaning in Unstable Power Environments — Uganda and East Africa Best Practices",
        brand: "General",
        machine_category: "best_practices",
        machine_subtype: null,
        applicable_models: ["all"],
        type: "article",
        url: "https://www.kaercher.com/int/professional",
        description: "Practical guide for operating cleaning machines in Uganda and East Africa where power supply can be unstable. Covers voltage surge protection, battery machine advantages, generator sizing, and machine shutdown procedures during power cuts.",
        key_topics: [
            "Voltage surge protection for corded machines",
            "Why battery machines are preferred in power-unstable environments",
            "Generator sizing for different machine types",
            "Safe shutdown during unexpected power cuts",
            "Preventing motor burnout from voltage fluctuations"
        ],
        best_practices: [
            "Always use a stabiliser or AVR (Automatic Voltage Regulator) with corded electric machines — Uganda's grid voltage can fluctuate ±15%, which damages motors",
            "Battery-powered machines (scrubber dryers, sweepers, vacuums) are safer in power-unstable environments — no risk of surge damage",
            "If using a generator, size it to at least 2x the machine's rated wattage — under-sized generators cause voltage sag that burns motor windings",
            "If power cuts occur mid-cleaning, always lower the brush deck and engage the squeegee before the machine loses power — leaving the brush on the floor damages the bristles",
            "Keep battery machines on charge whenever not in use — power cuts are unpredictable and a charged battery ensures cleaning can continue",
            "For petrol/diesel pressure washers: use fresh fuel — stale fuel (over 30 days old) causes engine starting problems and carburetor fouling"
        ],
        intensity_level: "all",
        language: "English",
        free: true
    },
    {
        id: "TR037",
        title: "Spare Parts and Maintenance in Uganda — Practical Guide for Cleaning Operators",
        brand: "General",
        machine_category: "best_practices",
        machine_subtype: null,
        applicable_models: ["all"],
        type: "article",
        url: "https://www.kaercher.com/int/support/service",
        description: "Practical maintenance guide for cleaning equipment operators in Uganda where spare parts may have long lead times. Covers preventive maintenance to extend machine life, critical spare parts to keep in stock, and local repair options.",
        key_topics: [
            "Preventive maintenance schedules for each machine type",
            "Critical spare parts to stock locally",
            "Lead time management for imported parts",
            "Basic on-site repairs operators can do themselves",
            "When to call a technician vs DIY repair"
        ],
        best_practices: [
            "Stock critical consumables locally: squeegee blades, brush pads, vacuum bags, and O-rings — these wear regularly and are often out of stock in Uganda",
            "Kärcher and Nilfisk spare parts average 7–21 days lead time from Kampala distributors — order before you run out, not after",
            "Operators can replace: squeegee blades, brush pads, dust bags, and hose washers without a technician",
            "Do not attempt to open the motor casing — motor repairs require specialist tools and training. A failed DIY motor repair voids the warranty",
            "Keep a maintenance log for each machine — record hours of use, consumable changes, and any faults. This significantly reduces diagnostic time when a technician visits",
            "Clean machines after every shift — the most common cause of early machine failure in Uganda is dirty machines left uncleaned overnight"
        ],
        intensity_level: "all",
        language: "English",
        free: true
    },
    {
        id: "TR038",
        title: "Personal Protective Equipment (PPE) for Cleaning Operators",
        brand: "General",
        machine_category: "safety",
        machine_subtype: null,
        applicable_models: ["all"],
        type: "article",
        url: "https://www.microfiberwholesale.com/blogs/blog/how-to-dilute-cleaning-product-correctly",
        description: "Safety guide for cleaning machine operators covering mandatory PPE requirements for different chemicals and machine types. Covers gloves, goggles, respiratory protection, anti-slip footwear, and ear protection for noisy machines.",
        key_topics: [
            "Chemical splash protection — gloves and goggles",
            "Respiratory protection for hazardous dust",
            "Anti-slip footwear on wet floors",
            "Ear protection for noisy pressure washers",
            "PPE for food-grade and hazardous environments"
        ],
        best_practices: [
            "Always wear chemical-resistant gloves when mixing or handling concentrated detergents — even neutral cleaners cause skin irritation with prolonged contact",
            "Wear safety goggles when using pressure washers or spray-applying chemicals — high-pressure spray and chemical mist can cause serious eye injury",
            "Use FFP2 or FFP3 respirator masks when vacuuming fine dust, cement, or any HEPA-classified hazardous material",
            "Wear rubber-soled anti-slip boots when cleaning with a scrubber dryer — wet floors from solution tank overflow are a slip hazard for the operator",
            "Pressure washers above 150 bar — always wear safety boots with steel toe caps. High-pressure water can cut through normal footwear",
            "In food-grade environments, wear disposable overalls and hairnets over regular PPE — cross-contamination from cleaning operatives is a food safety risk"
        ],
        intensity_level: "all",
        language: "English",
        free: true
    },
    {
        id: "TR039",
        title: "Chemical Safety — Storing, Handling, and Disposing of Cleaning Chemicals",
        brand: "General",
        machine_category: "safety",
        machine_subtype: null,
        applicable_models: ["all"],
        type: "article",
        url: "https://www.microfiberwholesale.com/blogs/blog/how-to-dilute-cleaning-product-correctly",
        description: "Chemical safety guide for cleaning operations. Covers correct storage of concentrated cleaning chemicals, incompatible chemical combinations to never mix, first aid for chemical exposure, and safe disposal of chemical waste water.",
        key_topics: [
            "Safe chemical storage — temperature, light, and segregation",
            "Chemicals that must NEVER be mixed",
            "First aid for skin and eye chemical exposure",
            "Disposing of chemical waste water responsibly",
            "Reading and understanding Safety Data Sheets (SDS)"
        ],
        best_practices: [
            "Store chemicals in a cool, ventilated, locked cupboard — heat and light degrade chemical effectiveness and can cause container pressure build-up",
            "NEVER mix bleach (chlorine) with ammonia-based cleaners — this produces toxic chloramine gas. Never mix bleach with acid cleaners — this produces chlorine gas",
            "NEVER mix alkaline (high pH) degreasers with acidic descalers in the same tank — violent exothermic reaction with splashing of corrosive liquid",
            "For skin contact with concentrated chemical: rinse with cold running water for 20 minutes. For eye contact: flush with water for 20 minutes and seek medical attention",
            "Dispose of diluted chemical wastewater through the drainage system — it is too dilute to harm the drainage system. Never dispose of concentrated chemicals in drains",
            "Keep Safety Data Sheets (SDS) for every chemical on site — in Uganda, this is a legal requirement for workplaces handling hazardous substances"
        ],
        intensity_level: "all",
        language: "English",
        free: true
    },
    {
        id: "TR040",
        title: "Total Cost of Ownership (TCO) — How to Calculate the True Cost of Cleaning Equipment",
        brand: "General",
        machine_category: "best_practices",
        machine_subtype: null,
        applicable_models: ["all"],
        type: "article",
        url: "https://www.kaercher.com/int/professional",
        description: "Practical guide to calculating and comparing the Total Cost of Ownership (TCO) for cleaning machines. Covers purchase price, annual maintenance, energy costs, spare parts, consumables, and operator time. Shows why the cheapest machine is rarely the cheapest to run.",
        key_topics: [
            "TCO formula: Purchase Price + Annual Maintenance + Running Costs",
            "Energy cost calculation per machine type",
            "Spare part and consumable cost budgeting",
            "Operator time value in the cleaning equation",
            "Comparing TCO across brands for the same task"
        ],
        best_practices: [
            "TCO formula: Annual TCO = Purchase Price + Annual Maintenance Cost + Annual Running Cost (electricity/fuel + consumables)",
            "A battery scrubber dryer costing UGX 50M with UGX 2M/year maintenance and UGX 1M/year running is often cheaper over 5 years than a UGX 30M corded machine requiring UGX 5M/year maintenance",
            "Energy cost matters: a 3 kW corded machine running 4 hours/day costs approximately UGX 1.7M/year in electricity at Uganda UMEME rates",
            "Include the cost of spare parts lead time — a machine out of service for 3 weeks waiting for parts has a hidden cost in paid operator idle time",
            "In Uganda, machines with locally available spare parts have a lower effective TCO even if the machine itself costs more upfront",
            "CleanMatch DSS calculates TCO automatically for each recommendation — always compare the TCO column, not just the purchase price"
        ],
        intensity_level: "all",
        language: "English",
        free: true
    },
    {
        id: "TR041",
        title: "Kärcher Academy — Professional Training Videos for Commercial Equipment",
        brand: "Karcher",
        machine_category: "best_practices",
        machine_subtype: null,
        applicable_models: ["all_karcher_professional"],
        type: "video",
        youtube_url: "https://www.kaercher.com/uk/services/professional/kaercher-academy/trainingvideos.html",
        description: "Kärcher Academy training video resource page for professional cleaning equipment. Covers the full range of Kärcher professional products with official training refresher videos for scrubber dryers, pressure washers, sweepers, and vacuum cleaners.",
        key_topics: [
            "Official Kärcher professional training refresher videos",
            "Machine-specific operation guides",
            "Maintenance and safety refreshers",
            "New operator onboarding content",
            "Chemical and detergent training modules"
        ],
        best_practices: [
            "Use Kärcher Academy videos as structured onboarding material for new cleaning staff — watching before first use reduces operator error and machine damage",
            "Schedule refresher training every 6 months for all operators — correct technique prevents premature machine wear",
            "Document training completion for each operator — this demonstrates due diligence if machine damage or accidents occur"
        ],
        intensity_level: "commercial_to_industrial",
        language: "English",
        free: true
    },
    {
        id: "TR042",
        title: "Kärcher Operating Manuals — PDF Downloads for All Machines",
        brand: "Karcher",
        machine_category: "best_practices",
        machine_subtype: null,
        applicable_models: ["all_karcher"],
        type: "pdf",
        url: "https://www.kaercher.com/int/support/service/downloads/operating-manuals.html",
        description: "Official Kärcher online portal for downloading PDF operating manuals for all Kärcher cleaning machines. Search by product name or model number to download the correct multi-language operating instructions.",
        key_topics: [
            "Finding the correct manual for your machine",
            "Multi-language support including French and Arabic",
            "Safety instructions section",
            "Technical specifications per model",
            "Fault-finding and error code tables"
        ],
        best_practices: [
            "Always download and read the specific manual for your exact model number — machines in the same range can have different specifications and safety requirements",
            "Keep a printed copy of the manual with the machine — field operators need access without internet connectivity",
            "The fault-finding section in the manual resolves 70% of common machine problems without a technician visit",
            "Check the manual for the correct recommended detergent concentration — using too much detergent voids the machine warranty in some models"
        ],
        intensity_level: "all",
        language: "English",
        free: true
    },
    {
        id: "TR043",
        title: "Numatic International — Full Product Training Videos Library",
        brand: "Numatic",
        machine_category: "best_practices",
        machine_subtype: null,
        applicable_models: ["all_numatic"],
        type: "video",
        youtube_url: "https://www.youtube.com/playlist?list=PLL8RFLr8EcfTs0ESup941X9-3FgEoGAuJ",
        description: "Numatic International's official YouTube playlist of product training and demonstration videos. Covers the full range including Henry vacuum cleaners, scrubber dryers, carpet extractors, and wet-and-dry vacuums.",
        key_topics: [
            "Henry and NVR vacuum cleaner series",
            "TT and TTB scrubber dryer series",
            "George and WFF carpet extractors",
            "NTD and WVD industrial wet-and-dry vacuums",
            "NuChem chemical product guides"
        ],
        best_practices: [
            "Numatic machines are designed for hard use in commercial environments — follow the training videos for correct operation to realise the full service life",
            "The TwinFlo motor is Numatic's key technology — understanding how it combines scrubbing and suction in one motor is essential for correct maintenance",
            "Numatic's NX1K battery platform is interchangeable across the TTB scrubber dryer range — this reduces spare battery stock needed"
        ],
        intensity_level: "commercial",
        language: "English",
        free: true
    },
    {
        id: "TR044",
        title: "Nilfisk Official YouTube Channel — Product Demonstrations and Training",
        brand: "Nilfisk",
        machine_category: "best_practices",
        machine_subtype: null,
        applicable_models: ["all_nilfisk"],
        type: "video",
        youtube_url: "https://www.youtube.com/@NilfiskGlobal",
        description: "Nilfisk Global's official YouTube channel. Contains product demonstrations, use-and-care videos, maintenance guides, and application-specific cleaning tutorials for the SC, BR, CR, SR, and VP/GD product ranges.",
        key_topics: [
            "SC series scrubber dryer use and care",
            "BR and CR ride-on scrubber dryer training",
            "SR sweeper operation",
            "VP and GD vacuum cleaner guides",
            "Nilfisk RS robotic scrubber setup"
        ],
        best_practices: [
            "Use Nilfisk's use-and-care videos as structured onboarding for new operators — they cover operation and maintenance in a single short video",
            "Subscribe to the Nilfisk channel for product update notifications — Nilfisk regularly releases new operator guides when firmware or accessories are updated"
        ],
        intensity_level: "commercial_to_industrial",
        language: "English",
        free: true
    },
    {
        id: "TR045",
        title: "Backpack Vacuum Cleaner — Ergonomic Use and Best Practices",
        brand: "General",
        machine_category: "vacuum_cleaner",
        machine_subtype: "backpack_vacuum",
        applicable_models: ["Kärcher BVL 5/1 Bp", "Nilfisk BP30", "Numatic NRV200", "Numatic NR200"],
        type: "article",
        url: "https://numatic.com/our-products/",
        description: "Ergonomic operation guide for backpack vacuum cleaners. Covers correct harness fitting to prevent back injury, balanced weight distribution, cleaning stairwells and elevated areas, and daily maintenance.",
        key_topics: [
            "Correct harness fitting to prevent back injury",
            "Balanced weight distribution when carrying",
            "Cleaning stairs, corridors, and elevated areas",
            "Battery vs corded — range and mobility trade-offs",
            "End-of-shift maintenance and bag change"
        ],
        best_practices: [
            "Adjust the shoulder and waist straps so the machine sits high on the back — a low-hanging machine causes lower back strain",
            "Always use two hands to lift the backpack on — ask a colleague to help on first use to find the correct fit",
            "Backpack vacuums are 3x faster than upright vacuums on staircases and tight corridors — reserve them for these areas",
            "For battery backpack models, charge overnight before each shift — battery range is typically 45–90 minutes under load",
            "Never lean heavily forward while wearing the backpack — the weight shifts to the lower back. Keep an upright posture",
            "Change the filter bag when 2/3 full — a full bag on a backpack vacuum causes the motor to overheat due to restricted airflow"
        ],
        intensity_level: "commercial",
        language: "English",
        free: true
    },
    {
        id: "TR046",
        title: "Water-Fed Pole System for Window Cleaning — Operation Guide",
        brand: "General",
        machine_category: "window_cleaner",
        machine_subtype: "water_fed_pole",
        applicable_models: ["Kärcher WFP 60 Plus", "Nilfisk WFC400", "Numatic NPW40"],
        type: "article",
        url: "https://www.kaercher.com/int/professional",
        description: "Water-fed pole (WFP) system operation guide for commercial window cleaning at height. Covers pure water production by reverse osmosis or deionisation, brush technique for first-clean vs maintenance, TDS (Total Dissolved Solids) monitoring, and safe pole extension at height.",
        key_topics: [
            "Pure water system — why it leaves no residue",
            "TDS monitoring — target below 10 ppm",
            "First-clean technique vs maintenance cleaning",
            "Safe working at height with extended poles",
            "Pole storage and brush maintenance"
        ],
        best_practices: [
            "Pure water (below 10 ppm TDS) dries without leaving residue or streaks — no squeegee needed on clean windows",
            "On first use on dirty windows, scrub thoroughly and rinse twice — initial soil contamination reduces pure water effectiveness",
            "Work from top to bottom with slow overlapping strokes — rinse water should run over already-cleaned areas to prevent re-soiling",
            "In Uganda, hard water from bore holes can have TDS above 500 ppm — a reverse osmosis or deionisation unit is essential before the pole system",
            "Never extend a carbon fibre pole near overhead electrical lines — carbon fibre conducts electricity and poses fatal electrocution risk",
            "Rinse the brush thoroughly after every use — soil in the brush fibres leaves streaks on the next clean window"
        ],
        intensity_level: "commercial",
        language: "English",
        free: true
    },
    {
        id: "TR047",
        title: "Kärcher HD Series Pressure Washer — Maintenance Tutorial",
        brand: "Karcher",
        machine_category: "pressure_washer",
        machine_subtype: "electric_pressure_washer",
        applicable_models: ["HD 6/15 C", "HD 6/15 M", "HD 9/23 G"],
        type: "video",
        youtube_url: "https://www.youtube.com/watch?v=G9_vI-YMhr4",
        description: "Detailed maintenance tutorial for Kärcher HD professional pressure washer range. Covers annual pump oil change, O-ring inspection and replacement, lance and nozzle care, winterising the machine, and the importance of running the pump dry-prevention test.",
        key_topics: [
            "Annual pump oil change procedure",
            "O-ring inspection and replacement",
            "Nozzle cleaning and wear testing",
            "Winterising with antifreeze",
            "Dry-run prevention checks"
        ],
        best_practices: [
            "Change pump oil every 500 hours or annually — dark or milky pump oil indicates water contamination and imminent pump failure",
            "Inspect all O-rings annually — replace any O-ring that is cracked, flattened, or discoloured. Carry spare O-ring kits on site",
            "Test nozzle spray angle annually with a nozzle wear gauge — a worn nozzle reduces cleaning pressure by up to 20%",
            "Before storage longer than 2 weeks: run clean water through the system for 2 minutes, then run antifreeze solution to protect the pump seals",
            "Never start the machine without water connected — dry running destroys the pump seals within 30 seconds"
        ],
        intensity_level: "commercial_to_industrial",
        language: "English",
        free: true
    },
    {
        id: "TR048",
        title: "Kärcher Puzzi — iCapsol Carpet Encapsulation Technology Explained",
        brand: "Karcher",
        machine_category: "carpet_cleaner",
        machine_subtype: "walk_behind_extractor",
        applicable_models: ["Puzzi 8/1 C", "Puzzi 10/1", "Puzzi 30/4"],
        type: "article",
        url: "https://www.kaercher.com/int/professional/carpet-care/carpet-cleaners.html",
        description: "Technical guide to Kärcher's iCapsol encapsulation technology for carpet cleaning. Explains how the encapsulation polymers surround soil particles and crystallise as they dry, allowing removal by vacuuming rather than wet extraction — resulting in faster drying and re-soiling resistance.",
        key_topics: [
            "How encapsulation polymers work",
            "iCapsol vs traditional hot water extraction comparison",
            "Application technique for maximum encapsulation",
            "Dry time after iCapsol treatment",
            "Post-treatment vacuuming for crystal removal"
        ],
        best_practices: [
            "iCapsol treatment dries in 20–30 minutes vs 4–6 hours for wet extraction — ideal for hotels and offices that cannot close areas for long",
            "Apply iCapsol at 1:10 dilution with the Puzzi spray-and-brush head, then allow to dry — do not rinse out",
            "After full drying, vacuum thoroughly with a commercial vacuum — the crystallised polymer with encapsulated soil is removed by the vacuum",
            "iCapsol prevents re-soiling for 6–8 weeks longer than standard extraction cleaning because the polymer creates an anti-soil barrier",
            "For heavily soiled carpets, a preliminary hot-water extraction pass followed by iCapsol treatment gives the best combined result",
            "Test on a small inconspicuous area first — some carpet dyes can be affected by the encapsulation polymers"
        ],
        intensity_level: "commercial",
        language: "English",
        free: true
    },
    {
        id: "TR049",
        title: "Scrubber Dryer vs Mop and Bucket — The Business Case for Mechanised Cleaning",
        brand: "General",
        machine_category: "best_practices",
        machine_subtype: null,
        applicable_models: ["all_scrubber_dryers"],
        type: "article",
        url: "https://www.kaercher.com/int/professional/floor-care/scrubber-driers.html",
        description: "Business case article comparing scrubber dryer cleaning against traditional mop-and-bucket methods. Covers productivity (m²/hour), hygiene outcomes, water and chemical usage, operator health, and return on investment for Ugandan facilities.",
        key_topics: [
            "Productivity comparison: scrubber dryer vs mop",
            "Hygiene outcomes — why mops spread bacteria",
            "Water and chemical consumption comparison",
            "Operator health — ergonomics of scrubber dryers",
            "Return on investment calculation"
        ],
        best_practices: [
            "A walk-behind scrubber dryer cleans 800–1,200 m²/hour vs 200–300 m²/hour with a mop and bucket — 4–5x productivity increase",
            "A mop picks up soil from the floor but then redistributes it across the next 10–15 m² — a scrubber dryer immediately recovers all soil into the recovery tank",
            "Scrubber dryers use 40–60% less water than mop-and-bucket cleaning for the same floor area",
            "Mop-and-bucket leaves floors wet for 30–45 minutes — this is the highest-risk period for slip-and-fall accidents. A scrubber dryer leaves floors dry in under 60 seconds",
            "For a 2,000 m² facility cleaned daily: a scrubber dryer saves approximately 2 staff hours per day. At UGX 15,000/hour labour cost, this saves UGX 10.9M per year — enough to finance a mid-range scrubber dryer in 3–5 years"
        ],
        intensity_level: "commercial_to_industrial",
        language: "English",
        free: true
    },
    {
        id: "TR050",
        title: "Food Safety Cleaning — HACCP-Compliant Cleaning Procedures for Food Facilities",
        brand: "General",
        machine_category: "safety",
        machine_subtype: null,
        applicable_models: ["all"],
        type: "article",
        url: "https://www.kaercher.com/int/professional/cleaning-and-care-products/professional.html",
        description: "HACCP (Hazard Analysis and Critical Control Points) cleaning guide for food processing facilities, canteens, and kitchens in Uganda. Covers cleaning and disinfection scheduling, food-safe chemical selection, equipment certification for food zones, and documentation requirements.",
        key_topics: [
            "Clean-in-place vs clean-out-of-place procedures",
            "Food-safe chemical certification requirements",
            "Equipment for food zones — stainless steel and food-grade plastics",
            "Cleaning and disinfection frequency schedule",
            "Documentation and verification requirements"
        ],
        best_practices: [
            "Food-zone cleaning follows a 4-step process: 1) Remove gross soil 2) Apply food-safe alkaline cleaner (e.g. RM 735 or FPA-1) 3) Rinse with clean water 4) Apply food-safe disinfectant (e.g. NuBac) at correct concentration and contact time",
            "Never use the same mop, brush, or equipment in food zones and toilet areas — colour-code equipment by zone (e.g. red for toilets, green for food areas)",
            "All chemicals used in food production areas must be certified food-safe and GRAS (Generally Recognised As Safe) or have NSF certification",
            "Document every cleaning cycle in a HACCP log — when, what chemical, concentration, operator name. This is mandatory for UNBS-certified food facilities in Uganda",
            "After cleaning, verify cleanliness with ATP swab testing — a positive result triggers immediate re-cleaning before food production resumes"
        ],
        intensity_level: "industrial",
        language: "English",
        free: true
    },
    {
        id: "TR051",
        title: "Nilfisk RS500 Autonomous Robot Scrubber — Setup and Fleet Management",
        brand: "Nilfisk",
        machine_category: "scrubber_dryer",
        machine_subtype: "robotic_scrubber",
        applicable_models: ["RS500"],
        type: "article",
        url: "https://www.nilfisk.com/global/consumer/",
        description: "Nilfisk RS500 robotic scrubber setup and fleet management guide. Covers LiDAR-based mapping, virtual boundary setting, multi-zone scheduling, the Nilfisk Cloud monitoring platform, and integration with facility management systems.",
        key_topics: [
            "LiDAR mapping of the cleaning environment",
            "Virtual boundary and no-go zone configuration",
            "Multi-zone and multi-shift scheduling",
            "Nilfisk Cloud remote monitoring",
            "Detergent dosing in autonomous mode"
        ],
        best_practices: [
            "Map the environment during working hours with people and equipment present — the robot will encounter these conditions during operation",
            "Set the cleaning schedule for low-traffic hours (night or early morning) — the robot is most efficient when the floor is clear",
            "Use only Nilfisk-recommended low-foam floor detergent in the RS500 — high-foam detergents cause sensor fouling that triggers false obstacle detection",
            "Monitor the Nilfisk Cloud dashboard for missed zones — the RS500 logs all coverage data and flags uncleaned areas",
            "Perform a manual deep-clean of corners and edges monthly — the RS500 cannot reach within 15 cm of walls and obstacles"
        ],
        intensity_level: "commercial",
        language: "English",
        free: true
    },
    {
        id: "TR052",
        title: "Numatic RSB140NX Robotic Scrubber — Operation and Navigation",
        brand: "Numatic",
        machine_category: "scrubber_dryer",
        machine_subtype: "robotic_scrubber",
        applicable_models: ["RSB140NX"],
        type: "article",
        url: "https://numatic.com/our-products/",
        description: "Numatic RSB140NX robotic scrubber operation guide. Covers the teach-and-repeat mapping system (operator walks the route once, robot repeats it autonomously), NX1K battery management, and integration with the Numatic Fleet Management System.",
        key_topics: [
            "Teach-and-repeat mapping — operator teaches the route",
            "NX1K battery management for all-night runs",
            "Numatic Fleet Management System monitoring",
            "Obstacle detection and safe stop behaviour",
            "Detergent dosing and tank management"
        ],
        best_practices: [
            "The RSB140NX uses teach-and-repeat — the operator walks the route at normal cleaning speed once, then the robot repeats it perfectly",
            "Teach the route in the environment's normal working state — if furniture moves after teaching, re-teach the affected zone",
            "The NX1K battery lasts approximately 3–4 hours autonomous operation — schedule the job to complete within one battery charge or install a second battery",
            "Check that floor drains and cable channels are covered before autonomous runs — the robot's wheels can jam in unprotected floor openings",
            "Review the Fleet Management System log after every autonomous run — any route deviations or obstacle stops indicate an environmental change that needs addressing"
        ],
        intensity_level: "commercial",
        language: "English",
        free: true
    },
    {
        id: "TR053",
        title: "Petrol Pressure Washer — Safe Operation and Fuel Management",
        brand: "General",
        machine_category: "pressure_washer",
        machine_subtype: "petrol_pressure_washer",
        applicable_models: ["Kärcher HD 6/15 G Classic", "Kärcher HD 9/23 G", "Nilfisk Poseidon 3-36 PE"],
        type: "article",
        url: "https://www.kaercher.com/int/professional/high-pressure-cleaners/petrol-pressure-washers.html",
        description: "Safe operation guide for petrol-powered pressure washers. Covers fuel type selection, safe refuelling procedure, engine warm-up, correct operating area (outdoor only due to exhaust fumes), and engine storage/winterising.",
        key_topics: [
            "Correct fuel type and mix ratio",
            "Safe refuelling procedure — never when hot",
            "Engine warm-up before applying full load",
            "Exhaust fume safety — outdoor use only",
            "End-of-season storage with fuel stabiliser"
        ],
        best_practices: [
            "NEVER use a petrol pressure washer indoors or in enclosed spaces — exhaust fumes contain carbon monoxide (CO), a colourless odourless gas that is rapidly fatal",
            "Always refuel with the engine stopped and cooled — petrol on a hot engine causes immediate fire",
            "Use fresh petrol (less than 30 days old) — stale petrol varnishes the carburetor and causes difficult starting",
            "Allow the engine to idle for 2 minutes before applying full cleaning load — cold engines need warm-up time to protect the cylinder and piston",
            "For storage longer than 3 months: add fuel stabiliser, run for 5 minutes to circulate, then drain the fuel tank and run until empty — this prevents varnish build-up in the fuel system",
            "Check engine oil level before every use — petrol engines in pressure washers are high-revving and oil consumption is higher than vehicle engines"
        ],
        intensity_level: "commercial_to_industrial",
        language: "English",
        free: true
    },
    {
        id: "TR054",
        title: "Numatic NTT2045 Industrial Scrubber Dryer — Heavy-Duty Operation",
        brand: "Numatic",
        machine_category: "scrubber_dryer",
        machine_subtype: "walk_behind_scrubber_dryer",
        applicable_models: ["NTT1840", "NTT2045", "TBL4055"],
        type: "article",
        url: "https://numatic.com/our-products/",
        description: "Numatic heavy-duty industrial scrubber dryer operation guide for warehouse and factory floors. Covers operating on uneven surfaces, handling oil and grease with NuGen degreaser, the high-recovery squeegee system, and routine maintenance for continuous multi-shift use.",
        key_topics: [
            "Operating on uneven warehouse floors",
            "Oil and grease cleaning with NuGen degreaser",
            "High-recovery squeegee for oily floors",
            "Multi-shift battery charging strategy",
            "Routine maintenance for industrial environments"
        ],
        best_practices: [
            "For factory floors with oil: pre-apply NuGen degreaser at 1:10 dilution and allow 5 minutes dwell, then scrub — the TwinFlo motor and aggressive cylindrical brushes handle heavy grease deposits",
            "Oily floors require more frequent squeegee blade changes — oil causes the rubber to swell and lose its sealing contact with the floor",
            "For multi-shift operation, use the hot-swap NX1K battery system — keep 2 batteries charged so cleaning is never interrupted",
            "After cleaning oily factory floors, flush the solution and recovery tanks with clean hot water — residual oil in tanks becomes rancid and causes bad odour",
            "Inspect the brush motor carbon brushes every 3 months in industrial environments — heavy soil and grit accelerate brush wear significantly compared to commercial use"
        ],
        intensity_level: "industrial",
        language: "English",
        free: true
    },
    {
        id: "TR055",
        title: "Disinfection vs Cleaning — Understanding the Difference for Facility Managers",
        brand: "General",
        machine_category: "detergents_and_chemicals",
        machine_subtype: null,
        applicable_models: ["all"],
        type: "article",
        url: "https://unilever-professional.com/blogs/upro-knowledge-hub/floor-cleaning-chemicals-type",
        description: "Practical guide for facility managers on the difference between cleaning (removing visible soil) and disinfection (killing micro-organisms). Covers when each is required, product selection, the importance of cleaning before disinfecting, and contact time requirements.",
        key_topics: [
            "Cleaning vs disinfecting vs sanitising — definitions",
            "Why you must clean before you disinfect",
            "Contact time requirements for disinfectants",
            "EN 14476 disinfectant certification explained",
            "Combining cleaning and disinfection in one step"
        ],
        best_practices: [
            "CLEAN FIRST, DISINFECT SECOND — organic soil deactivates most disinfectants. A disinfectant applied to a dirty surface is largely ineffective",
            "Contact time matters — a disinfectant must remain wet on the surface for the minimum contact time (usually 5–10 minutes) to achieve the rated kill",
            "Look for EN 14476 certification on disinfectants — this is the European standard for virucidal activity used in Uganda's certified facilities",
            "Nilfisk DFC-1 and Numatic NuBac are combined cleaner-disinfectants — they clean and disinfect in one step for low-to-medium risk environments",
            "High-risk areas (hospitals, food factories, isolation rooms): use separate cleaning then disinfection steps for maximum efficacy",
            "Steam cleaning at temperatures above 80°C achieves disinfection without chemicals — steam is the most effective disinfection method for equipment and hard surfaces"
        ],
        intensity_level: "commercial_to_industrial",
        language: "English",
        free: true
    },
    {
        id: "TR056",
        title: "Kärcher KM 130/300 R D Diesel Ride-On Sweeper — Industrial Operation",
        brand: "Karcher",
        machine_category: "sweeper",
        machine_subtype: "rider_sweeper",
        applicable_models: ["KM 130/300 R D"],
        type: "article",
        url: "https://www.kaercher.com/int/professional/sweepers/ride-on-sweepers.html",
        description: "Kärcher KM 130/300 large diesel ride-on sweeper operation guide for outdoor industrial and municipal applications. Covers diesel engine management, the high-dump container system, filtration maintenance, and safe operation on gradients and uneven terrain.",
        key_topics: [
            "Diesel engine pre-start and warm-up checks",
            "High-dump container operation",
            "Main brush and side brush height adjustment",
            "Filtration system and dust suppression",
            "Safe operation on gradients and ramps"
        ],
        best_practices: [
            "NEVER use a diesel sweeper in enclosed buildings — diesel exhaust fumes are harmful. For indoor use, use battery sweepers only",
            "Adjust the main brush height so bristles just touch the surface — over-aggressive brush contact damages the brush and the floor",
            "Empty the container when it is 70–80% full — a full container blocks the inlet, reducing sweeping effectiveness",
            "After sweeping dry materials, activate the water spray system for the final 10 minutes to settle residual dust in the container",
            "On gradients steeper than 5°, reduce speed and engage low gear — the loaded container significantly raises the centre of gravity",
            "Service the air filter every 50 hours in dusty outdoor environments — blocked air filters cause diesel engine overheating"
        ],
        intensity_level: "industrial",
        language: "English",
        free: true
    },
    {
        id: "TR057",
        title: "Kärcher K 7 Full Control — How to Clean a Car, Patio, and Facade",
        brand: "Karcher",
        machine_category: "pressure_washer",
        machine_subtype: "electric_pressure_washer",
        applicable_models: ["K 7 WCM", "K 7 Comfort Premium", "K 5 WCM"],
        type: "video",
        youtube_url: "https://www.youtube.com/watch?v=5e05S31KFyk",
        description: "Kärcher Australia official demonstration of the K4 and K7 pressure washer range covering vehicle washing, patio cleaning, and building facade cleaning. Shows correct nozzle selection, distance from surface, and detergent application technique.",
        key_topics: [
            "Vehicle washing — correct distance and technique",
            "Patio cleaner attachment for large flat surfaces",
            "Building facade cleaning from bottom to top",
            "Detergent application and rinse sequence",
            "Water-cooled motor advantages for sustained use"
        ],
        best_practices: [
            "For vehicle washing: pre-rinse with water, apply Kärcher RM 619 Vehicle Cleaner at low pressure, allow 3 minutes, rinse from top to bottom",
            "For patios: use the T-Racer patio cleaner attachment — it cleans faster and more evenly than the lance, with less splash-back",
            "For building facades: work bottom to top when applying detergent, top to bottom when rinsing — this prevents dirty water running over clean areas",
            "The K 7 WCM (water-cooled motor) can run continuously for extended periods — the standard K 7 with air-cooled motor should rest for 15 minutes after each 30 minutes of use",
            "Never use the rotary power nozzle on vehicle paintwork — it concentrates pressure enough to remove paint"
        ],
        intensity_level: "domestic_to_commercial",
        language: "English",
        free: true
    },
    {
        id: "TR058",
        title: "Nilfisk Dryft Micro Scrubber — Quick Start Guide",
        brand: "Nilfisk",
        machine_category: "scrubber_dryer",
        machine_subtype: "micro_scrubber",
        applicable_models: ["SC250"],
        type: "video",
        youtube_url: "https://www.youtube.com/watch?v=POfQ-RyPf9s",
        description: "Nilfisk Dryft micro scrubber quick-start guide. Shows setup in under 5 minutes, operating in tight spaces like restrooms and corridors, automatic brush pressure adjustment, and the one-button rinse cycle.",
        key_topics: [
            "5-minute quick start setup",
            "Tight-space manoeuvrability",
            "Automatic brush pressure adjustment",
            "One-button rinse cycle",
            "Compact storage and transport"
        ],
        best_practices: [
            "The Dryft micro scrubber is specifically designed for areas where a standard scrubber dryer cannot enter — restrooms, elevator lobbies, and server rooms",
            "The automatic brush pressure adjustment means no operator skill is needed — it always applies the correct pressure for the floor type",
            "Run the one-button rinse cycle at the end of every shift — it flushes the brush and squeegee system with clean water, preventing detergent residue build-up",
            "Despite its small size, the Dryft's recovery system keeps floors dry — safe to use in occupied spaces without wet floor signs"
        ],
        intensity_level: "commercial",
        language: "English",
        free: true
    },
    {
        id: "TR059",
        title: "Eco-Friendly Cleaning — Reducing Chemical and Water Use in Commercial Cleaning",
        brand: "General",
        machine_category: "best_practices",
        machine_subtype: null,
        applicable_models: ["all"],
        type: "article",
        url: "https://www.kaercher.com/int/inside-kaercher/difference-kaercher-magazine/kaercher-stories/how-does-a-pressure-washer-work.html",
        description: "Practical guide to reducing environmental impact in commercial cleaning operations. Covers eco-mode features in Kärcher and Nilfisk machines, biodegradable detergent selection, water recycling systems, and measuring and reporting environmental performance.",
        key_topics: [
            "Eco-mode features in modern machines",
            "Biodegradable and eco-certified detergents",
            "Water recycling for pressure washers",
            "Measuring water and chemical consumption",
            "Reporting environmental cleaning performance"
        ],
        best_practices: [
            "Kärcher eco!efficiency mode in scrubber dryers reduces water and chemical use by up to 50% for daily light maintenance — always use eco mode for routine cleaning",
            "Nilfisk SC series eco mode reduces solution flow rate by 30% — sufficient for light daily soil, significant cost saving over a month",
            "Choose biodegradable detergents wherever possible — Numatic NuGen, Kärcher RM 82N Natural, and Nilfisk products carry biodegradable certification",
            "A pressure washer uses 6–8x less water than a garden hose for the same cleaning result — this alone makes mechanical washing the eco-friendly choice",
            "Track your monthly water and chemical usage — most facilities that start tracking immediately identify waste and reduce consumption by 15–25% within 3 months",
            "Concentrated detergents reduce plastic packaging waste — 1 litre of concentrate replaces 50–200 litres of ready-to-use product"
        ],
        intensity_level: "all",
        language: "English",
        free: true
    },
    {
        id: "TR060",
        title: "Cleaning Schedule Planning — Daily, Weekly, and Periodic Maintenance Programmes",
        brand: "General",
        machine_category: "best_practices",
        machine_subtype: null,
        applicable_models: ["all"],
        type: "article",
        url: "https://www.kaercher.com/int/professional",
        description: "Practical guide to building a structured cleaning schedule for commercial and industrial facilities. Covers daily, weekly, monthly, and annual maintenance tasks for floors, surfaces, equipment, and chemicals. Includes a Uganda-specific schedule for facilities dealing with laterite soil and humid conditions.",
        key_topics: [
            "Daily maintenance tasks — floors, surfaces, equipment rinse",
            "Weekly deep clean zones and periodic surfaces",
            "Monthly maintenance — machine servicing and chemical audit",
            "Annual tasks — full machine service and replacement schedule",
            "Uganda-specific adjustments for laterite soil and humidity"
        ],
        best_practices: [
            "DAILY: Sweep or vacuum all floors, mop or scrub high-traffic areas, rinse all machine tanks, wipe down touch surfaces with disinfectant",
            "WEEKLY: Deep scrub all hard floors with periodic alkaline cleaner, clean restrooms with acid descaler on tile and grout, inspect all machine brushes and squeegees",
            "MONTHLY: Full machine maintenance check, review chemical stock and reorder, check water TDS if using water-fed pole system, review cleaning log and adjust schedule for problem areas",
            "ANNUALLY: Full machine service by qualified technician, replace consumables (brushes, squeegee blades, filter cartridges), review chemical contracts and pricing",
            "For Uganda facilities: schedule an extra red laterite deep-clean after heavy rain periods (April–May and October–November) when laterite soil is tracked in most heavily",
            "Post the cleaning schedule in the cleaning store — visible schedules improve operator compliance and make it easy to track what has been done"
        ],
        intensity_level: "all",
        language: "English",
        free: true
    }
];

// Helper to build a combined description from provided fields
function buildDescription(item) {
    let desc = item.description || '';
    if (item.key_topics && item.key_topics.length) {
        desc += '\n\nKey Topics:\n- ' + item.key_topics.join('\n- ');
    }
    if (item.best_practices && item.best_practices.length) {
        desc += '\n\nBest Practices:\n- ' + item.best_practices.join('\n- ');
    }
    // Add metadata
    if (item.brand) desc += `\n\nBrand: ${item.brand}`;
    if (item.machine_category) desc += `\nCategory: ${item.machine_category}`;
    if (item.machine_subtype) desc += `\nSubtype: ${item.machine_subtype}`;
    if (item.applicable_models && item.applicable_models.length) {
        desc += `\nApplicable Models: ${item.applicable_models.join(', ')}`;
    }
    if (item.intensity_level) desc += `\nIntensity: ${item.intensity_level}`;
    if (item.language) desc += `\nLanguage: ${item.language}`;
    if (item.free !== undefined) desc += `\nFree: ${item.free}`;
    return desc;
}

async function seedTrainings() {
    try {
        await connectDB();
        console.log('🔗 Connected to MongoDB');

        // Clear existing trainings
        const deleteResult = await Training.deleteMany({});
        console.log(`🗑️  Removed ${deleteResult.deletedCount} existing training records`);

        // Map data to Training model
        const trainingDocs = trainingsData.map(item => ({
            title: item.title,
            description: buildDescription(item),
            type: item.type === 'video' ? 'video' : (item.type === 'pdf' ? 'pdf' : 'article'),
            youtubeUrl: item.youtube_url || null,
            url: item.url || null,
            machineId: null, // No direct equipment reference – generic training
            active: true,
        }));

        // Insert with individual error handling
        let inserted = 0;
        let errors = [];
        for (const doc of trainingDocs) {
            try {
                await new Training(doc).save();
                inserted++;
            } catch (err) {
                errors.push({ title: doc.title, error: err.message });
                console.warn(`⚠️ Skipped "${doc.title}": ${err.message}`);
            }
        }

        console.log(`✅ Inserted ${inserted} out of ${trainingDocs.length} training materials.`);
        if (errors.length) {
            console.log(`❌ ${errors.length} entries failed:`);
            errors.forEach(e => console.log(`   - ${e.title}: ${e.error}`));
        }

        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        await mongoose.disconnect().catch(() => { });
        process.exit(1);
    }
}

seedTrainings();