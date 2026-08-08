from nasa import get_planets

planets = get_planets()

print("Number of planets:", len(planets))

print("\nFirst planet:")
print(planets[0])
