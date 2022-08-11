use company_db;

INSERT INTO departments (name)
VALUES ("Information Technology"),
       ("Engineering"),
       ("Finance"),
       ("Sales"),
       ("Human Resources");

       
INSERT INTO roles (title, salary, department_of)
VALUES ("Full stack developer", 120000, 1),
       ("Project Manager", 150000, 1),
       ("Service Technician", 100000, 2),
       ("Project Engineer", 110000, 2),
       ("Credit Analyst", 70000, 3),
       ("Banking Specialist", 130000, 3),
       ("Account Manager", 120000, 4),
       ("Sales Consultant", 95000, 4),
       ("Human Resource Manager", 75000, 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Sean", "Genge", 2, 1),
       ("Jie", "McDade", 1, 1),
       ("Mark", "Brown", 1, 1),
       ("Ashley", "Simmons", 7, 4),
       ("Phillip", "Treshley", 8, 4),
       ("Tim", "Paul", 6, 6),
       ("Violet", "Evergreen", 9, 7),
       ("Emily", "Flower", 4, 8),
       ("Simon", "Power", 3, 8),
       ("Wesley", "Jones", 2, 10),
       ("Oat", "tin", 1, 10);