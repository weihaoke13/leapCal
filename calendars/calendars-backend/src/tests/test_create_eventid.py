import unittest
from ..create_ids.create_eventid import Create_EventID
from unittest.mock import MagicMock
from unittest.mock import Mock

class TestCreateEventID(unittest.TestCase):
    crt_eventid = Create_EventID()

    def test_create_eventid(self):
        self.crt_eventid.count = 1
        expected_result = str(self.crt_eventid.count + 1) + 'a'

        # calling_create_eventid = self.crt_eventid.create_eventid()
        self.assertEqual(expected_result, '2a')        