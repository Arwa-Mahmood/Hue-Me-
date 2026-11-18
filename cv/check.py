# from color import analyse_hex
# for h in ['#FFDFC4','#F1C27D','#E0AC69','#C68642','#8D5524','#6B4226','#F5D0B9','#D9A07A']:
#     r = analyse_hex(h)
#     print(h, r['depth'], r['undertone'], r['season'], r['ita'])

from color import analyse_hex, hex_to_lab, hue_angle
for h in ['#FFDFC4','#F1C27D','#E0AC69','#C68642','#8D5524','#6B4226','#F5D0B9','#D9A07A']:
    r = analyse_hex(h)
    print(h, r['depth'], r['undertone'], round(hue_angle(hex_to_lab(h)), 1))