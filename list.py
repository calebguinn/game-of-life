import os

list = os.listdir("patterns/")
list.sort()
with open('list', 'w') as f:
  for item in list:
    item = item.removesuffix('.rle')
    item += '\n'
    f.write(item)
