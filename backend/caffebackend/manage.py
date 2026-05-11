#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

# Patch for removed cgi module in Python 3.13+
import email.message
class FakeCGI:
    @staticmethod
    def parse_header(line):
        m = email.message.Message()
        m['content-type'] = line
        return m.get_content_type(), m.get_params() or {}
sys.modules['cgi'] = FakeCGI()

def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'caffebackend.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
