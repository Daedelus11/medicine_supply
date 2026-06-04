(function () {
  'use strict';

  const PUB = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTQ9Ga8AQKmzLiaCdnc8J7mc7H8Z3gXijJv0G414_kL6d2Qm6OAVNTFJzl11V8AF2usc7jFRdc9aXbo/pub';
  const csv = (gid) => `${PUB}?gid=${gid}&single=true&output=csv`;

  window.FLS_CONFIG = {
    PROJECT_NAME:     'Dayspring Church',
    PROJECT_NUMBER:   '24-0701',
    PROJECT_LOCATION: 'Boise, Idaho',
    CLIENT_SLUG:      'dayspring',
    PASS_SITE:        'Dayspring2026',
    PASS_CONTRACTS:   'Dayspring5234',
    PASS_CA:          'Dayspring7823',
    SESS_SITE:        'fls-dayspring-site',
    SESS_CONTRACTS:   'fls-dayspring-contracts',
    SESS_CA:          'fls-dayspring-ca',
    HERO_IMAGE_URL:   '',
    HAS_CA:           true,
    PHOTOS_BASE_URL:  '',
    GID_CONTACTS:           '586416721',
    GID_TIMELINE:           '1806249059',
    GID_DOCUMENTS:          '175695946',
    GID_CONTRACT_DOCUMENTS: '1046882396',
    GID_INVOICES:           '1478450172',
    GID_STATEMENTS:         '960504539',
    GID_CA_PHOTOS:          '1545277247',
    GID_CA_REPORTS:         '1488387618',
    GID_SUBMITTALS:         '1188660052',
    GID_RFI:                '1736319343',
    URL_CONTACTS:           csv('586416721'),
    URL_TIMELINE:           csv('1806249059'),
    URL_DOCUMENTS:          csv('175695946'),
    URL_CONTRACT_DOCUMENTS: csv('1046882396'),
    URL_INVOICES:           csv('1478450172'),
    URL_STATEMENTS:         csv('960504539'),
    URL_CA_PHOTOS:          csv('1545277247'),
    URL_CA_REPORTS:         csv('1488387618'),
    URL_SUBMITTALS:         csv('1188660052'),
    URL_RFI:                csv('1736319343'),
  };
})();
