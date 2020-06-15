import unittest
from ..create_ids.create_userid import Create_UserID
from unittest.mock import MagicMock


class TestCreateUserID(unittest.TestCase):
    create_userid = Create_UserID()
    def test_create_token(self):
        fake_user_id = 'matthew'
        expected_result = 'matthewa'
        call_to_create_token = self.create_userid.create_token(fake_user_id)
        self.assertEqual(expected_result, call_to_create_token)

    def test_admin_password(self):
        self.create_userid.admin_pw = 'beep'
        expected_result = True
        fake_password = 'beep'

        call_to_admin_password = self.create_userid.admin_password(fake_password)
        self.assertEqual(expected_result, call_to_admin_password)
