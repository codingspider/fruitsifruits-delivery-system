<?php 

use Carbon\Carbon;
use App\Models\SellLine;
use App\Models\Transaction;
use App\Models\ReturnLeftoverItem;
use App\Models\DriverJuiceAllocationLine;

function timeZone(){
    $time = array(
        'Pacific/Midway' => -39600,
        'Pacific/Niue' => -39600,
        'Pacific/Pago_Pago' => -39600,
        'America/Adak' => -36000,
        'Pacific/Honolulu' => -36000,
        'Pacific/Johnston' => -36000,
        'Pacific/Rarotonga' => -36000,
        'Pacific/Tahiti' => -36000,
        'Pacific/Marquesas' => -34200,
        'America/Anchorage' => -32400,
        'Pacific/Gambier' => -32400,
        'America/Juneau' => -32400,
        'America/Nome' => -32400,
        'America/Sitka' => -32400,
        'America/Yakutat' => -32400,
        'America/Dawson' => -28800,
        'America/Los_Angeles' => -28800,
        'America/Metlakatla' => -28800,
        'Pacific/Pitcairn' => -28800,
        'America/Santa_Isabel' => -28800,
        'America/Tijuana' => -28800,
        'America/Vancouver' => -28800,
        'America/Whitehorse' => -28800,
        'America/Boise' => -25200,
        'America/Cambridge_Bay' => -25200,
        'America/Chihuahua' => -25200,
        'America/Creston' => -25200,
        'America/Dawson_Creek' => -25200,
        'America/Denver' => -25200,
        'America/Edmonton' => -25200,
        'America/Hermosillo' => -25200,
        'America/Inuvik' => -25200,
        'America/Mazatlan' => -25200,
        'America/Ojinaga' => -25200,
        'America/Phoenix' => -25200,
        'America/Shiprock' => -25200,
        'America/Yellowknife' => -25200,
        'America/Bahia_Banderas' => -21600,
        'America/Belize' => -21600,
        'America/North_Dakota/Beulah' => -21600,
        'America/Cancun' => -21600,
        'America/North_Dakota/Center' => -21600,
        'America/Chicago' => -21600,
        'America/Costa_Rica' => -21600,
        'Pacific/Easter' => -21600,
        'America/El_Salvador' => -21600,
        'Pacific/Galapagos' => -21600,
        'America/Guatemala' => -21600,
        'America/Indiana/Knox' => -21600,
        'America/Managua' => -21600,
        'America/Matamoros' => -21600,
        'America/Menominee' => -21600,
        'America/Merida' => -21600,
        'America/Mexico_City' => -21600,
        'America/Monterrey' => -21600,
        'America/North_Dakota/New_Salem' => -21600,
        'America/Rainy_River' => -21600,
        'America/Rankin_Inlet' => -21600,
        'America/Regina' => -21600,
        'America/Resolute' => -21600,
        'America/Swift_Current' => -21600,
        'America/Tegucigalpa' => -21600,
        'America/Indiana/Tell_City' => -21600,
        'America/Winnipeg' => -21600,
        'America/Atikokan' => -18000,
        'America/Bogota' => -18000,
        'America/Cayman' => -18000,
        'America/Detroit' => -18000,
        'America/Grand_Turk' => -18000,
        'America/Guayaquil' => -18000,
        'America/Havana' => -18000,
        'America/Indiana/Indianapolis' => -18000,
        'America/Iqaluit' => -18000,
        'America/Jamaica' => -18000,
        'America/Lima' => -18000,
        'America/Kentucky/Louisville' => -18000,
        'America/Indiana/Marengo' => -18000,
        'America/Kentucky/Monticello' => -18000,
        'America/Montreal' => -18000,
        'America/Nassau' => -18000,
        'America/New_York' => -18000,
        'America/Nipigon' => -18000,
        'America/Panama' => -18000,
        'America/Pangnirtung' => -18000,
        'America/Indiana/Petersburg' => -18000,
        'America/Port-au-Prince' => -18000,
        'America/Thunder_Bay' => -18000,
        'America/Toronto' => -18000,
        'America/Indiana/Vevay' => -18000,
        'America/Indiana/Vincennes' => -18000,
        'America/Indiana/Winamac' => -18000,
        'America/Caracas' => -16200,
        'America/Anguilla' => -14400,
        'America/Antigua' => -14400,
        'America/Aruba' => -14400,
        'America/Asuncion' => -14400,
        'America/Barbados' => -14400,
        'Atlantic/Bermuda' => -14400,
        'America/Blanc-Sablon' => -14400,
        'America/Boa_Vista' => -14400,
        'America/Campo_Grande' => -14400,
        'America/Cuiaba' => -14400,
        'America/Curacao' => -14400,
        'America/Dominica' => -14400,
        'America/Eirunepe' => -14400,
        'America/Glace_Bay' => -14400,
        'America/Goose_Bay' => -14400,
        'America/Grenada' => -14400,
        'America/Guadeloupe' => -14400,
        'America/Guyana' => -14400,
        'America/Halifax' => -14400,
        'America/Kralendijk' => -14400,
        'America/La_Paz' => -14400,
        'America/Lower_Princes' => -14400,
        'America/Manaus' => -14400,
        'America/Marigot' => -14400,
        'America/Martinique' => -14400,
        'America/Moncton' => -14400,
        'America/Montserrat' => -14400,
        'Antarctica/Palmer' => -14400,
        'America/Port_of_Spain' => -14400,
        'America/Porto_Velho' => -14400,
        'America/Puerto_Rico' => -14400,
        'America/Rio_Branco' => -14400,
        'America/Santiago' => -14400,
        'America/Santo_Domingo' => -14400,
        'America/St_Barthelemy' => -14400,
        'America/St_Kitts' => -14400,
        'America/St_Lucia' => -14400,
        'America/St_Thomas' => -14400,
        'America/St_Vincent' => -14400,
        'America/Thule' => -14400,
        'America/Tortola' => -14400,
        'America/St_Johns' => -12600,
        'America/Araguaina' => -10800,
        'America/Bahia' => -10800,
        'America/Belem' => -10800,
        'America/Argentina/Buenos_Aires' => -10800,
        'America/Argentina/Catamarca' => -10800,
        'America/Cayenne' => -10800,
        'America/Argentina/Cordoba' => -10800,
        'America/Fortaleza' => -10800,
        'America/Godthab' => -10800,
        'America/Argentina/Jujuy' => -10800,
        'America/Argentina/La_Rioja' => -10800,
        'America/Maceio' => -10800,
        'America/Argentina/Mendoza' => -10800,
        'America/Miquelon' => -10800,
        'America/Montevideo' => -10800,
        'America/Paramaribo' => -10800,
        'America/Recife' => -10800,
        'America/Argentina/Rio_Gallegos' => -10800,
        'Antarctica/Rothera' => -10800,
        'America/Argentina/Salta' => -10800,
        'America/Argentina/San_Juan' => -10800,
        'America/Argentina/San_Luis' => -10800,
        'America/Santarem' => -10800,
        'America/Sao_Paulo' => -10800,
        'Atlantic/Stanley' => -10800,
        'America/Argentina/Tucuman' => -10800,
        'America/Argentina/Ushuaia' => -10800,
        'America/Noronha' => -7200,
        'Atlantic/South_Georgia' => -7200,
        'Atlantic/Azores' => -3600,
        'Atlantic/Cape_Verde' => -3600,
        'America/Scoresbysund' => -3600,
        'Africa/Abidjan' => 0,
        'Africa/Accra' => 0,
        'Africa/Bamako' => 0,
        'Africa/Banjul' => 0,
        'Africa/Bissau' => 0,
        'Atlantic/Canary' => 0,
        'Africa/Casablanca' => 0,
        'Africa/Conakry' => 0,
        'Africa/Dakar' => 0,
        'America/Danmarkshavn' => 0,
        'Europe/Dublin' => 0,
        'Africa/El_Aaiun' => 0,
        'Atlantic/Faroe' => 0,
        'Africa/Freetown' => 0,
        'Europe/Guernsey' => 0,
        'Europe/Isle_of_Man' => 0,
        'Europe/Jersey' => 0,
        'Europe/Lisbon' => 0,
        'Africa/Lome' => 0,
        'Europe/London' => 0,
        'Atlantic/Madeira' => 0,
        'Africa/Monrovia' => 0,
        'Africa/Nouakchott' => 0,
        'Africa/Ouagadougou' => 0,
        'Atlantic/Reykjavik' => 0,
        'Africa/Sao_Tome' => 0,
        'Atlantic/St_Helena' => 0,
        'UTC' => 0,
        'Africa/Algiers' => +3600,
        'Europe/Amsterdam' => +3600,
        'Europe/Andorra' => +3600,
        'Africa/Bangui' => +3600,
        'Europe/Belgrade' => +3600,
        'Europe/Berlin' => +3600,
        'Europe/Bratislava' => +3600,
        'Africa/Brazzaville' => +3600,
        'Europe/Brussels' => +3600,
        'Europe/Budapest' => +3600,
        'Europe/Busingen' => +3600,
        'Africa/Ceuta' => +3600,
        'Europe/Copenhagen' => +3600,
        'Africa/Douala' => +3600,
        'Europe/Gibraltar' => +3600,
        'Africa/Kinshasa' => +3600,
        'Africa/Lagos' => +3600,
        'Africa/Libreville' => +3600,
        'Europe/Ljubljana' => +3600,
        'Arctic/Longyearbyen' => +3600,
        'Africa/Luanda' => +3600,
        'Europe/Luxembourg' => +3600,
        'Europe/Madrid' => +3600,
        'Africa/Malabo' => +3600,
        'Europe/Malta' => +3600,
        'Europe/Monaco' => +3600,
        'Africa/Ndjamena' => +3600,
        'Africa/Niamey' => +3600,
        'Europe/Oslo' => +3600,
        'Europe/Paris' => +3600,
        'Europe/Podgorica' => +3600,
        'Africa/Porto-Novo' => +3600,
        'Europe/Prague' => +3600,
        'Europe/Rome' => +3600,
        'Europe/San_Marino' => +3600,
        'Europe/Sarajevo' => +3600,
        'Europe/Skopje' => +3600,
        'Europe/Stockholm' => +3600,
        'Europe/Tirane' => +3600,
        'Africa/Tripoli' => +3600,
        'Africa/Tunis' => +3600,
        'Europe/Vaduz' => +3600,
        'Europe/Vatican' => +3600,
        'Europe/Vienna' => +3600,
        'Europe/Warsaw' => +3600,
        'Africa/Windhoek' => +3600,
        'Europe/Zagreb' => +3600,
        'Europe/Zurich' => +3600,
        'Europe/Athens' => +7200,
        'Asia/Beirut' => +7200,
        'Africa/Blantyre' => +7200,
        'Europe/Bucharest' => +7200,
        'Africa/Bujumbura' => +7200,
        'Africa/Cairo' => +7200,
        'Europe/Chisinau' => +7200,
        'Asia/Damascus' => +7200,
        'Africa/Gaborone' => +7200,
        'Asia/Gaza' => +7200,
        'Africa/Harare' => +7200,
        'Asia/Hebron' => +7200,
        'Europe/Helsinki' => +7200,
        'Europe/Istanbul' => +7200,
        'Asia/Jerusalem' => +7200,
        'Africa/Johannesburg' => +7200,
        'Europe/Kiev' => +7200,
        'Africa/Kigali' => +7200,
        'Africa/Lubumbashi' => +7200,
        'Africa/Lusaka' => +7200,
        'Africa/Maputo' => +7200,
        'Europe/Mariehamn' => +7200,
        'Africa/Maseru' => +7200,
        'Africa/Mbabane' => +7200,
        'Asia/Nicosia' => +7200,
        'Europe/Riga' => +7200,
        'Europe/Simferopol' => +7200,
        'Europe/Sofia' => +7200,
        'Europe/Tallinn' => +7200,
        'Europe/Uzhgorod' => +7200,
        'Europe/Vilnius' => +7200,
        'Europe/Zaporozhye' => +7200,
        'Africa/Addis_Ababa' => +10800,
        'Asia/Aden' => +10800,
        'Asia/Amman' => +10800,
        'Indian/Antananarivo' => +10800,
        'Africa/Asmara' => +10800,
        'Asia/Baghdad' => +10800,
        'Asia/Bahrain' => +10800,
        'Indian/Comoro' => +10800,
        'Africa/Dar_es_Salaam' => +10800,
        'Africa/Djibouti' => +10800,
        'Africa/Juba' => +10800,
        'Europe/Kaliningrad' => +10800,
        'Africa/Kampala' => +10800,
        'Africa/Khartoum' => +10800,
        'Asia/Kuwait' => +10800,
        'Indian/Mayotte' => +10800,
        'Europe/Minsk' => +10800,
        'Africa/Mogadishu' => +10800,
        'Europe/Moscow' => +10800,
        'Africa/Nairobi' => +10800,
        'Asia/Qatar' => +10800,
        'Asia/Riyadh' => +10800,
        'Antarctica/Syowa' => +10800,
        'Asia/Tehran' => +12600,
        'Asia/Baku' => +14400,
        'Asia/Dubai' => +14400,
        'Indian/Mahe' => +14400,
        'Indian/Mauritius' => +14400,
        'Asia/Muscat' => +14400,
        'Indian/Reunion' => +14400,
        'Europe/Samara' => +14400,
        'Asia/Tbilisi' => +14400,
        'Europe/Volgograd' => +14400,
        'Asia/Yerevan' => +14400,
        'Asia/Kabul' => +16200,
        'Asia/Aqtau' => +18000,
        'Asia/Aqtobe' => +18000,
        'Asia/Ashgabat' => +18000,
        'Asia/Dushanbe' => +18000,
        'Asia/Karachi' => +18000,
        'Indian/Kerguelen' => +18000,
        'Indian/Maldives' => +18000,
        'Antarctica/Mawson' => +18000,
        'Asia/Oral' => +18000,
        'Asia/Samarkand' => +18000,
        'Asia/Tashkent' => +18000,
        'Asia/Colombo' => +19800,
        'Asia/Kolkata' => +19800,
        'Asia/Kathmandu' => +20700,
        'Asia/Almaty' => +21600,
        'Asia/Bishkek' => +21600,
        'Indian/Chagos' => +21600,
        'Asia/Dhaka' => +21600,
        'Asia/Qyzylorda' => +21600,
        'Asia/Thimphu' => +21600,
        'Antarctica/Vostok' => +21600,
        'Asia/Yekaterinburg' => +21600,
        'Indian/Cocos' => +23400,
        'Asia/Rangoon' => +23400,
        'Asia/Bangkok' => +25200,
        'Indian/Christmas' => +25200,
        'Antarctica/Davis' => +25200,
        'Asia/Ho_Chi_Minh' => +25200,
        'Asia/Hovd' => +25200,
        'Asia/Jakarta' => +25200,
        'Asia/Novokuznetsk' => +25200,
        'Asia/Novosibirsk' => +25200,
        'Asia/Omsk' => +25200,
        'Asia/Phnom_Penh' => +25200,
        'Asia/Pontianak' => +25200,
        'Asia/Vientiane' => +25200,
        'Asia/Brunei' => +28800,
        'Antarctica/Casey' => +28800,
        'Asia/Choibalsan' => +28800,
        'Asia/Chongqing' => +28800,
        'Asia/Harbin' => +28800,
        'Asia/Hong_Kong' => +28800,
        'Asia/Kashgar' => +28800,
        'Asia/Krasnoyarsk' => +28800,
        'Asia/Kuala_Lumpur' => +28800,
        'Asia/Kuching' => +28800,
        'Asia/Macau' => +28800,
        'Asia/Makassar' => +28800,
        'Asia/Manila' => +28800,
        'Australia/Perth' => +28800,
        'Asia/Shanghai' => +28800,
        'Asia/Singapore' => +28800,
        'Asia/Taipei' => +28800,
        'Asia/Ulaanbaatar' => +28800,
        'Asia/Urumqi' => +28800,
        'Australia/Eucla' => +31500,
        'Asia/Dili' => +32400,
        'Asia/Irkutsk' => +32400,
        'Asia/Jayapura' => +32400,
        'Pacific/Palau' => +32400,
        'Asia/Pyongyang' => +32400,
        'Asia/Seoul' => +32400,
        'Asia/Tokyo' => +32400,
        'Australia/Adelaide' => +34200,
        'Australia/Broken_Hill' => +34200,
        'Australia/Darwin' => +34200,
        'Australia/Brisbane' => +36000,
        'Pacific/Chuuk' => +36000,
        'Australia/Currie' => +36000,
        'Antarctica/DumontDUrville' => +36000,
        'Pacific/Guam' => +36000,
        'Australia/Hobart' => +36000,
        'Asia/Khandyga' => +36000,
        'Australia/Lindeman' => +36000,
        'Australia/Melbourne' => +36000,
        'Pacific/Port_Moresby' => +36000,
        'Pacific/Saipan' => +36000,
        'Australia/Sydney' => +36000,
        'Asia/Yakutsk' => +36000,
        'Australia/Lord_Howe' => +37800,
        'Pacific/Efate' => +39600,
        'Pacific/Guadalcanal' => +39600,
        'Pacific/Kosrae' => +39600,
        'Antarctica/Macquarie' => +39600,
        'Pacific/Noumea' => +39600,
        'Pacific/Pohnpei' => +39600,
        'Asia/Sakhalin' => +39600,
        'Asia/Ust-Nera' => +39600,
        'Asia/Vladivostok' => +39600,
        'Pacific/Norfolk' => +41400,
        'Asia/Anadyr' => +43200,
        'Pacific/Auckland' => +43200,
        'Pacific/Fiji' => +43200,
        'Pacific/Funafuti' => +43200,
        'Asia/Kamchatka' => +43200,
        'Pacific/Kwajalein' => +43200,
        'Asia/Magadan' => +43200,
        'Pacific/Majuro' => +43200,
        'Antarctica/McMurdo' => +43200,
        'Pacific/Nauru' => +43200,
        'Antarctica/South_Pole' => +43200,
        'Pacific/Tarawa' => +43200,
        'Pacific/Wake' => +43200,
        'Pacific/Wallis' => +43200,
        'Pacific/Chatham' => +45900,
        'Pacific/Apia' => +46800,
        'Pacific/Enderbury' => +46800,
        'Pacific/Fakaofo' => +46800,
        'Pacific/Tongatapu' => +46800,
        'Pacific/Kiritimati' => +50400,
    );
    return $time;
}


function paidSell($request){
    $paid_sell_query = Transaction::query()
        ->with([
            'location:id,name',
            'sell_lines.product:id,cost_price',
            'sell_lines.bottle:id,cost_price',
            'sell_lines.flavor:id,name',
        ]);

    // ✅ Filters
    if ($request->start_date && $request->end_date) {
        $paid_sell_query->whereDate('created_at', '>=', $request->start_date)->whereDate('created_at', '<=', $request->end_date);
    }

    if ($request->location_id) {
        $paid_sell_query->where('location_id', $request->location_id);
    }

    $paid_sell_query->where('transaction_type', 'sell')->where('status', 'paid');

    return $paid_sell_query;
}

function unPaidSell($request){
    $unpaid_sell_query = Transaction::query()
        ->with([
            'location:id,name',
            'sell_lines.product:id,cost_price',
            'sell_lines.bottle:id,cost_price',
            'sell_lines.flavor:id,name',
        ]);

    // ✅ Filters
    if ($request->start_date && $request->end_date) {
        $unpaid_sell_query->whereDate('created_at', '>=', $request->start_date)->whereDate('created_at', '<=', $request->end_date);
    }

    if ($request->location_id) {
        $unpaid_sell_query->where('location_id', $request->location_id);
    }

    $unpaid_sell_query->where('transaction_type', 'sell')->where('status', '!=', 'paid');

    return $unpaid_sell_query;
}


function getAllocated($startDate, $endDate, $flavour_id, $bottle_id){
    $query = DriverJuiceAllocationLine::query();
    if($startDate && $endDate){
        $query->whereDate('created_at', '>=', $startDate)->whereDate('created_at', '<=', $endDate);
    }else{
        $query->whereDate('created_at', '=', Carbon::today());
    }

    $data = $query->where('flavour_id', $flavour_id)->where('bottle_id', $bottle_id)->first();
    return $data->quantity ?? 0;
}


function getDelivered($startDate, $endDate, $flavour_id, $bottle_id){
    $query = SellLine::query();
    if($startDate && $endDate){
        $query->whereDate('created_at', '>=', $startDate)->whereDate('created_at', '<=', $endDate);
    }else{
        $query->whereDate('created_at', '=', Carbon::today());
    }

    $data = $query->where('flavour_id', $flavour_id)->where('bottle_id', $bottle_id)->sum('to_be_filled');
    return $data;
}


function getReturned($startDate, $endDate, $flavour_id, $bottle_id){
    $query = ReturnLeftoverItem::query();
    if($startDate && $endDate){
        $query->whereDate('created_at', '>=', $startDate)->whereDate('created_at', '<=', $endDate);
    }else{
        $query->whereDate('created_at', '=', Carbon::today());
    }

    $data = $query->where('flavour_id', $flavour_id)->where('bottle_id', $bottle_id)->sum('quantity');
    return $data;
}


function getSoldQtyByLocation($location_id, $flavour_id, $startDate = null, $endDate = null)
{
    // Build query on SellLine joined with Transactions
    $query = SellLine::query()
        ->join('transactions', 'sell_lines.transaction_id', '=', 'transactions.id')
        ->where('transactions.location_id', $location_id)
        ->where('transactions.transaction_type', 'sell')
        ->where('sell_lines.flavour_id', $flavour_id);

    // Filter by date if provided
    if ($startDate && $endDate) {
        $query->whereBetween('transactions.created_at', [
            $startDate . ' 00:00:00',
            $endDate . ' 23:59:59'
        ]);
    }

    // Return the sum
    return $query->sum('sell_lines.to_be_filled');
}

function getTaxByLocation($location_id, $startDate = null, $endDate = null)
{
    // Build query on SellLine joined with Transactions
    $query = Transaction::query()
        ->join('sells', 'sells.transaction_id', '=', 'transactions.id')
        ->where('transactions.transaction_type', 'sell')
        ->where('transactions.location_id', $location_id);

    // Filter by date if provided
    if ($startDate && $endDate) {
        $query->whereBetween('transactions.created_at', [
            $startDate . ' 00:00:00',
            $endDate . ' 23:59:59'
        ]);
    }

    // Return the sum
    return $query->sum('sells.tax');
}
