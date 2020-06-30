/*
    Below, you may find translations used by all (sub)componnets.
    They are further added as properties to the main widget (see its get properties for details).
    They are declared here rather than in get properties to avoid looong list of properties (redability).

    If you find you need some additional translation, please add it to the below object.
*/

export const refDictionary = {
    stringAddFilter:               'Add Filter',
    stringApply:                   'Apply',
    stringSelectFilterFirst:       'Select Filter First',
    stringPleaseSelectDateOrRange: 'Please select data or range',
    stringClearSelectedItems:      'Clear Selected Items',
    stringSelectAll:               'Select All',
    stringSelectMultipleValues:    'Select Multiple Values',
    stringAddValue:                'Add Value',
    stringBetween:                 'Between',
    stringFrom:                    'from',
    stringOutside:                 'Outside',
    stringTo:                      'to',
    stringAnd:                     'and',
    stringAll:                     'All',
    stringSelected:                'selected',
    stringShowMore:                'Show more',
    stringShowLess:                'Show less',
    stringStartDateLabel:          'From',
    stringEndDateLabel:            'To',
    stringRangeHintText:           'Select date',
    stringDoneLabelButton:         'Done'
};
/* The returned object has the following structure:
{
    stringAddFilter: {
        type: String,
        value: 'Add Filter'
    },
    stringApply: {
        type: String,
        value: 'Apply'
    },
    ...
    ...
}
*/
export function getStringBasedProperties() {
    const stringBasedProperties = {};
    Object.keys(refDictionary).forEach(keyStringProp => {
        stringBasedProperties[keyStringProp] = {
            type:  String,
            value: refDictionary[keyStringProp]
        };
    });
    return stringBasedProperties;
}
