const user = [
  // correct details 0
  {
    user: {
      firstname: 'test',
      lastname: 'testlastname',
      username: 'testusername',
      email: 'test@testdomain.com',
      password: 'P@ssword123'
    }
  },
  // wrong email 1
  {
    user: {
      firstname: 'test',
      lastname: 'testlastname',
      username: 'testusername',
      email: 'testdomain.com',
      password: 'P@ssword123'
    }
  },
  // no firstname 2
  {
    user: {
      firstname: '',
      lastname: 'testlastname',
      username: 'testusername',
      email: 'test@domain.com',
      password: 'P@ssword123'
    }
  },
  // no lastname 3
  {
    user: {
      firstname: 'test',
      lastname: '',
      username: 'testusername',
      email: 'test@domain.com',
      password: 'P@ssword123'
    }
  },
  // no username 4
  {
    user: {
      firstname: 'test',
      lastname: 'testlastname',
      username: '',
      email: 'test@domain.com',
      password: 'P@ssword123'
    }
  },
  // invalid firstname 5
  {
    user: {
      firstname: 'test2019',
      lastname: 'testlastname',
      username: 'testusername',
      email: 'test@domain.com',
      password: 'P@ssword123'
    }
  },
  // invalid lastname 6
  {
    user: {
      firstname: 'test',
      lastname: 'testlastname2019',
      username: 'testusername',
      email: 'test@domain.com',
      password: 'P@ssword123'
    }
  },
  // invalid username length < 3 7
  {
    user: {
      firstname: 'test',
      lastname: 'testlastname',
      username: 'te',
      email: 'test@domain.com',
      password: 'P@ssword123'
    }
  },
  // invalid username length > 16 8
  {
    user: {
      firstname: 'test',
      lastname: 'testlastname',
      username: 'testusername65281092',
      email: 'test@domain.com',
      password: 'P@ssword123'
    }
  },
  // invalid username characters 9
  {
    user: {
      firstname: 'test',
      lastname: 'testlastname',
      username: 'test@*#jos',
      email: 'test@domain.com',
      password: 'P@ssword123'
    }
  },
  // correct login details 10
  {
    user: {
      email: 'test@testdomain.com',
      password: 'P@ssword123'
    }
  },
  // wrong login email 11
  {
    user: {
      email: 'wrong@testdomain.com',
      password: 'P@ssword123'
    }
  },
  // wrong password 12
  {
    user: {
      email: 'test@testdomain.com',
      password: 'P@ssword123ndo'
    }
  },
  // invalid email 13
  {
    user: {
      email: 'testtestdomain.com',
      password: 'P@ssword123'
    }
  },
  // weak password 14
  {
    user: {
      email: 'test@testdomain.com',
      password: 'password'
    }
  },
  // short password 15
  {
    user: {
      email: 'test@testdomain.com',
      password: 'P@s1'
    }
  },
  // short password signup 16
  {
    user: {
      firstname: 'test',
      lastname: 'testlastname',
      username: 'testusername',
      email: 'test@testdomain.com',
      password: 'P@s1'
    }
  },
  // weak password signup 17
  {
    user: {
      firstname: 'test',
      lastname: 'testlastname',
      username: 'testusername',
      email: 'test@testdomain.com',
      password: 'password'
    }
  },
  // 18
  {
    user: {
      firstname: 'testProfile',
      lastname: 'testlastname',
      username: 'testprofile',
      email: 'testsProfile@testdomain.com',
      password: 'a@Hcommando1'
    }
  },
  // 19
  {
    user: {
      email: 'testProfile@testdomain.testcom',
      password: 'a@Hcommando1'
    }
  },
  // user correct details 20
  {
    user: {
      firstname: 'test',
      lastname: 'testlastname',
      username: 'testingusername',
      email: 'test@testerdomain.com',
      password: 'P@ssword123'
    }
  },
  // user login 21
  {
    user: {
      email: 'test@testerdomain.com',
      password: 'P@ssword123'
    }
  },
  // this user is NOT active 22
  {
    user: {
      firstname: 'inactive',
      lastname: 'test',
      username: 'testinactiveuser',
      email: 'test@inactive.com',
      password: 'P@ssword123',
      isActive: false
    }
  },
  // change the role of an existing user 23
  {
    newRole: 'moderator',
    username: 'admin'
  },
  // this user is an admin 24
  {
    user: {
      firstname: 'admin',
      lastname: 'admin',
      username: 'admin',
      email: 'admin@admin.com',
      password: 'P@ssword123',
      role: 'admin'
    }
  },
  // this user is a moderator 25
  {
    user: {
      firstname: 'moderator',
      lastname: 'moderator',
      username: 'moderator',
      email: 'moderator@moderator.com',
      password: 'P@ssword123',
      role: 'moderator'
    }
  },
  // this user is a god 26
  {
    user: {
      firstname: 'god',
      lastname: 'god',
      username: 'god',
      email: 'god@god.com',
      password: 'P@ssword123',
      role: 'god'
    }
  },
  // sign in inactive user 27
  {
    user: {
      email: 'test@inactive.com',
      password: 'P@ssword123',
    }
  },
  // sign in an admin 28
  {
    user: {
      email: 'admin@admin.com',
      password: 'P@ssword123',
    }
  },
  // wrong choice of role type 29
  {
    newRole: 'chux',
    username: 'testinactiveuser'
  },
  // sign in a moderator 30
  {
    user: {
      email: 'moderator@moderator.com',
      password: 'P@ssword123',
    }
  },
  // change the role of an existing user 31
  {
    newRole: 'moderator',
    username: 'idonotexist'
  },
  // role type god 32
  {
    newRole: 'god',
    username: 'testinactiveuser'
  },
  // role type admin 33
  {
    newRole: 'admin',
    username: 'testinactiveuser'
  },
  // sign in a god 34
  {
    user: {
      email: 'god@god.com',
      password: 'P@ssword123'
    }
  },
  // god creates a user 35
  {
    user: {
      firstname: 'newfirstname',
      lastname: 'newlastname',
      username: 'firstlastname',
      role: 'moderator',
      email: 'newfirstname@email.com'
    }
  },
  // god updates a user 36
  {
    user: {
      firstname: 'newupdate',
      username: 'updatelastname',
      role: 'moderator',
      email: 'newfirstname@email.com'
    }
  }
];

export default user;
