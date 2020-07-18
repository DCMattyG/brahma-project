from setuptools import setup, find_packages

setup(
  name='brahma_cli',
  version='0.1.0',
  packages=find_packages(include=['brahma_cli', 'brahma_cli.*']),
  install_requires=[
    'requests',
    'argparse',
    'shortuuid',
    'six',
  ],
  entry_points={
    'console_scripts': ['brahma-cli=brahma_cli.brahma:main']
  }
)
