create schema if not exists chat default character set utf8 collate utf8_general_ci;

use chat;

create table if not exists user (
	id int primary key auto_increment,
	username varchar(64) not null unique,
	name varchar(64) not null,
	password varchar(64) not null,
	createTime timestamp default current_timestamp,
	index(username)
);

create table if not exists chat (
	id int primary key auto_increment,
	name varchar(64) not null,
	createTime timestamp default current_timestamp,
	index(name)
);

create table if not exists chat_user (
	chat_id int not null,
	user_id int not null,
	createTime timestamp default current_timestamp,
	primary key (chat_id, user_id),
	foreign key (chat_id) references chat(id) on delete restrict,
	foreign key (user_id) references user(id) on delete restrict
);

create table if not exists message (
	id int primary key auto_increment,
	chat_id int not null,
	user_id int not null,
	type varchar(64) not null,
	content varchar(255) not null,
	createTime timestamp default current_timestamp,
	foreign key (chat_id) references chat(id) on delete restrict,
	foreign key (user_id) references user(id) on delete restrict
);