const fs = require('fs')
const csv = require('csvtojson')
const jsoncsv = require('json-2-csv')

const properties = [
  'OrganisationURI',
  'OrganisationLabel',
  'SiteReference',
  'PreviouslyPartOf',
  'SiteNameAddress',
  'SiteplanURL',
  'CoordinateReferenceSystem',
  'GeoX',
  'GeoY',
  'Hectares',
  'OwnershipStatus',
  'Deliverable',
  'PlanningStatus',
  'PermissionType',
  'PermissionDate',
  'PlanningHistory',
  'ProposedForPIP',
  'MinNetDwellings',
  'DevelopmentDescription',
  'NonHousingDevelopment',
  'Part2',
  'NetDwellingsRangeFrom',
  'NetDwellingsRangeTo',
  'HazardousSubstances',
  'SiteInformation',
  'Notes',
  'FirstAddedDate',
  'LastUpdatedDate',
  'Easting', // these need to be added to schema
  'Northing' // these need to be added to schema
]

function readLocalFiles () {
  return fs.readdirSync('./reg').map(function (filename) {
    return {
      file: filename,
      contents: fs.readFileSync('./reg/' + filename).toString()
    }
  })
}

const mappable = {
  'Application Description/ Notes': 'Notes',
  'Coordinate Reference System': 'CoordinateReferenceSystem',
  'Development Description': 'DevelopmentDescription',
  'First Added Date': 'FirstAddedDate',
  'FirstAddedDate\n': 'FirstAddedDate',
  'GeoX [East]': 'GeoX',
  'GeoY [North]': 'GeoY',
  'Hazardous Substances ': 'HazardousSubstances',
  'Hazardous Substances [as identifiied in Appl. form]': 'HazardousSubstances',
  'Hazardous Substances': 'HazardousSubstances',
  'Last Update': 'LastUpdatedDate',
  'Last Updated Date': 'LastUpdatedDate',
  'Mapping link [SiteplanURL]': 'SiteplanURL',
  'Min Net Dwellings': 'MinNetDwellings',
  'Net Dwellings Range From': 'NetDwellingsRangeFrom',
  'Net Dwellings Range To': 'NetDwellingsRangeTo',
  'NetDwellingsRangeTo\n': 'NetDwellingsRangeTo',
  'Non Housing Development': 'NonHousingDevelopment',
  'NonHousing Development': 'NonHousingDevelopment',
  'NonHousingDevelopment\n': 'NonHousingDevelopment',
  'Organisation Label': 'OrganisationLabel',
  'Ownership Status': 'OwnershipStatus',
  'OwnershipStatus\n\n': 'OwnershipStatus',
  'Part 2': 'Part2',
  'Permission Date': 'PermissionDate',
  'Permission Type': 'PermissionType',
  'Permission Types as req. by Gov.': 'PermissionType',
  'Planning History link': 'PlanningHistory',
  'Planning History': 'PlanningHistory',
  'Planning Status': 'PlanningStatus',
  'Previously Part Of': 'PreviouslyPartOf',
  'Proposed For PIP': 'ProposedForPIP',
  'Proposed for PIP': 'ProposedForPIP',
  'Site Area in ha': 'Hectares',
  'Site Areaha [0.25ha min]': 'Hectares',
  'Site Information': 'SiteInformation',
  'Site Name Address': 'SiteNameAddress',
  'Site plan URL': 'SiteplanURL',
  'Site Ref': 'SiteReference',
  'Site Reference': 'SiteReference',
  'SiteReference\n': 'SiteReference',
  CoordinateRefSystem: 'CoordinateReferenceSystem',
  CordinateReferenceSystem: 'CoordinateReferenceSystem',
  EASTING: 'Easting',
  Eastings: 'Easting',
  MinDetDwellings: 'MinNetDwellings',
  NetDwellingsRangeForm: 'NetDwellingsRangeFrom',
  NetDwellingsRangeto: 'NetDwellingsRangeTo',
  NonHousingDeveloment: 'NonHousingDevelopment',
  NORTHING: 'Northing',
  Northings: 'Northing',
  OSEasting: 'Easting',
  OSGB36Easting: 'Easting',
  OSGB36Northing: 'Northing',
  OSNorthing: 'Northing',
  OwenrshipStatus: 'OwnershipStatus',
  ownershipStatus: 'OwnershipStatus',
  PermissionHistory: 'PlanningHistory',
  PeviouslyPartof: 'PeviouslyPartOf',
  planningStatus: 'PlanningStatus',
  ProposedforPIP: 'ProposedForPIP',
  ProposedForPiP: 'ProposedForPIP',
  SiteNameAddresss: 'SiteNameAddress',
  Siteplan: 'SiteplanURL',
  SitePlanURL: 'SiteplanURL'
  // DateUpdate: 'LastUpdatedDate'
}

const counts = {}

const start = readLocalFiles().map(async function (file) {
  if (file.contents.startsWith('OrganisationURI')) {
    const json = await csv({
      ignoreEmpty: true,
      flatKeys: true
    }).fromString(file.contents)

    return json.map(function (row) {
      const keys = Object.keys(row)

      for (const i in keys) {
        // Count of keys
        counts[keys[i]] = counts[keys[i]] ? (counts[keys[i]] + 1) : 1

        // Map keys
        if (mappable[keys[i]]) {
          row[mappable[keys[i]]] = row[mappable[keys[i]]] || row[mappable[keys[i]]]
          console.log(row['OrganisationLabel'], 'Setting', keys[i], 'to', mappable[keys[i]])
        }

        // Remove extra keys
        if (!properties.includes(keys[i])) {
          console.log(row['OrganisationLabel'], 'Deleting', keys[i], 'from CSV')
          delete row[keys[i]]
        }

        if (row['PlanningStatus']) {
          row['PlanningStatus'] = row['PlanningStatus'].toLowerCase()
        }

        if (row['OwnershipStatus']) {
          row['OwnershipStatus'] = row['OwnershipStatus'].toLowerCase()
        }

        if (row['CoordinateReferenceSystem']) {
          row['CoordinateReferenceSystem'] = row['CoordinateReferenceSystem'].toUpperCase()
        }

        if (row['Deliverable']) {
          row['Deliverable'] = row['Deliverable'].toLowerCase()
        }

        if (row['PermissionType']) {
          row['PermissionType'] = row['PermissionType'].toLowerCase()
        }

        if (row['ProposedForPIP']) {
          row['ProposedForPIP'] = row['ProposedForPIP'].toLowerCase()
        }

        if (row['Part2']) {
          row['Part2'] = row['Part2'].toLowerCase()
        }

        if (row['HazardousSubstances']) {
          row['HazardousSubstances'] = row['HazardousSubstances'].toLowerCase()
        }
      }

      return row
    }) || ''
  }
})

Promise.all(start).then(async function (done) {
  const filter = done.filter(function (item) {
    return item
  })

  const flat = [].concat.apply([], filter).sort(function (a, b) {
    if (a.OrganisationLabel < b.OrganisationLabel) { return -1 }
    if (a.OrganisationLabel > b.OrganisationLabel) { return 1 }
    return 0
  })

  const conv = await jsoncsv.json2csvAsync(flat, { emptyFieldValue: '' })
  fs.writeFileSync('./concat.csv', conv, 'utf8')

  let sortable = []
  for (const key in counts) {
    if (!properties.includes(key) && !mappable[key]) {
      sortable.push([key, counts[key]])
    }
  }

  sortable = sortable.sort(function (a, b) {
    return b[1] - a[1]
  })

  console.log(JSON.stringify(sortable, null, 4))
})
