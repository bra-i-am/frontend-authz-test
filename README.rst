frontend-authz
##############

|license-badge| |status-badge| |ci-badge| |codecov-badge|

.. |license-badge| image:: https://img.shields.io/github/license/openedx/frontend-authz.svg
    :target: https://github.com/openedx/frontend-authz/blob/master/LICENSE
    :alt: License

.. |status-badge| image:: https://img.shields.io/badge/Status-Experimental-yellow

.. |ci-badge| image:: https://github.com/openedx/frontend-authz/actions/workflows/ci.yml/badge.svg
    :target: https://github.com/openedx/frontend-authz/actions/workflows/ci.yml
    :alt: Continuous Integration

.. |codecov-badge| image:: https://codecov.io/github/openedx/frontend-authz/coverage.svg?branch=master
    :target: https://codecov.io/github/openedx/frontend-authz?branch=master
    :alt: Codecov

Purpose
=======

``frontend-authz`` provides reusable permission-validation hooks and an API client
for integrating the `openedx-authz <https://github.com/openedx/openedx-authz>`_ backend service into Open edX MFEs.

It is designed to be consumed by both MFEs on ``frontend-platform``/``frontend-build``
and those migrated to ``frontend-base``, without introducing cross-dependencies between
base libraries.

Getting Started
===============

Installation
------------

.. code-block:: bash

    npm install @openedx/frontend-authz

Usage
-----

Documentation and usage examples will be added as the implementation is completed.
See ``docs/how_tos/`` for how-to guides as they become available.

Development
-----------

.. code-block:: bash

    npm install
    npm test
    npm run lint

Getting Help
============

If you're having trouble, we have discussion forums at
https://discuss.openedx.org where you can connect with others in the community.

Our real-time conversations are on Slack. You can request a `Slack
invitation`_, then join our `community Slack workspace`_. Because this is a
frontend repository, the best place to discuss it would be in the `#wg-frontend
channel`_.

For anything non-trivial, the best path is to open an issue in this repository
with as many details about the issue you are facing as you can provide.

https://github.com/openedx/frontend-authz/issues

For more information about these options, see the `Getting Help`_ page.

.. _Slack invitation: https://openedx.org/slack
.. _community Slack workspace: https://openedx.slack.com/
.. _#wg-frontend channel: https://openedx.slack.com/archives/C04BM6YC7A6
.. _Getting Help: https://openedx.org/getting-help

License
=======

The code in this repository is licensed under the AGPLv3 unless otherwise
noted.

Please see `LICENSE <LICENSE>`_ for details.

Contributing
============

Contributions are very welcome. Please read `How To Contribute`_ for details.

.. _How To Contribute: https://openedx.org/r/how-to-contribute

The Open edX Code of Conduct
============================

All community members are expected to follow the `Open edX Code of Conduct`_.

.. _Open edX Code of Conduct: https://openedx.org/code-of-conduct/

People
======

The assigned maintainers for this component and other project details may be
found in `Backstage`_. Backstage pulls this data from the ``catalog-info.yaml``
file in this repo.

.. _Backstage: https://open-edx-backstage.herokuapp.com/catalog/default/component/frontend-authz

Reporting Security Issues
=========================

Please do not report security issues in public. Email security@openedx.org instead.
